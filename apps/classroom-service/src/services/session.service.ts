import { logger } from "@ilm/http-kit";
import { MemberRole, Prisma } from "../../prisma/generated";
import { ForbiddenError, SessionEndedError, SessionNotFoundError } from "../errors/AppError";
import { getClassRoster } from "../lib/academic";
import { closeRoom, createJoinToken, listActiveRooms, livekitUrl, ParticipantRole } from "../lib/livekit";
import * as sessionRepo from "../repositories/session.repository";

type Actor = { sub: string, username: string, roles: string[] };

const isAdmin = (actor: Actor) => actor.roles.includes("admin");

// A session's room only exists once someone connects, so a session younger
// than this may simply not have been joined yet.
const ABANDONED_AFTER_MS = 2 * 60_000;

/**
 * Ends live sessions whose LiveKit room is gone — everyone left without
 * pressing End class — and returns the ones still running.
 *
 * Stopgap until the room_finished webhook ends sessions as it happens. If
 * LiveKit can't be reached, nothing is ended: a stale entry in the list is
 * better than ending a class people are in.
 */
const pruneAbandoned = async <T extends { id: string; startedAt: Date }>(sessions: T[]): Promise<T[]> => {
    const candidates = sessions.filter((s) => Date.now() - s.startedAt.getTime() > ABANDONED_AFTER_MS);
    if (candidates.length === 0) return sessions;

    let active: Set<string>;
    try {
        active = await listActiveRooms(candidates.map((s) => s.id));
    } catch (error) {
        logger.warn({ err: error }, "could not check LiveKit rooms; keeping sessions live");
        return sessions;
    }

    const abandoned = new Set(candidates.filter((s) => !active.has(s.id)).map((s) => s.id));
    for (const id of abandoned) {
        await sessionRepo.endSession(id);
        logger.info({ sessionId: id }, "ended abandoned class session");
    }
    return sessions.filter((s) => !abandoned.has(s.id));
};

/**
 * Starting is idempotent: if the class is already live, the existing session
 * comes back, so a second click — or a second teacher — joins the same room.
 * That second start also adds anyone enrolled or linked since the first, so
 * starting again is how a late student gets let in.
 *
 * unlinkedStudents counts enrolled students with no login account: they are
 * left out of the session, and the caller should be told.
 */
const startSession = async (classId: string, actor: Actor, authorization: string, requestId?: string) => {
    // Fetched first, before even checking for a live session: this call is
    // also the authorization check, and an already-live session must not
    // be handed to someone academic-service would have refused.
    const roster = await getClassRoster(classId, authorization, requestId);

    // Keyed by userId: one person, one membership, teacher role winning if
    // the same account somehow appears twice.
    const members = new Map<string, { userId: string; username: string; role: MemberRole }>();
    let unlinkedStudents = 0;
    for (const student of roster.students) {
        // A student without a linked login account has nothing to join with.
        if (!student.userId || !student.loginUsername) {
            unlinkedStudents++;
            continue;
        }
        members.set(student.userId, { userId: student.userId, username: student.loginUsername, role: MemberRole.STUDENT });
    }
    members.set(roster.teacherUserId, { userId: roster.teacherUserId, username: roster.teacherUsername, role: MemberRole.TEACHER });

    if (unlinkedStudents > 0) {
        logger.warn({ classId, unlinkedStudents }, "enrolled students without a login account left out of the session");
    }

    // A live session nobody is in anymore is ended here, and a fresh one
    // started below — otherwise Start would rejoin yesterday's class.
    const existing = await sessionRepo.findLiveByClass(classId);
    const [live] = existing ? await pruneAbandoned([existing]) : [];
    if (live) {
        await sessionRepo.addMembers(live.id, [...members.values()]);
        return { ...live, unlinkedStudents };
    }

    try {
        const session = await sessionRepo.createSession({
            classId,
            className: roster.name,
            startedByUserId: actor.sub,
            startedByUsername: actor.username,
            members: [...members.values()],
        });
        logger.info({ sessionId: session.id, classId, memberCount: members.size }, "class session started");
        return { ...session, unlinkedStudents };
    } catch (error) {
        // Lost a race with a concurrent start: liveClassId is unique, so the
        // other request's session is the one to join.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            const winner = await sessionRepo.findLiveByClass(classId);
            if (winner) {
                await sessionRepo.addMembers(winner.id, [...members.values()]);
                return { ...winner, unlinkedStudents };
            }
        }
        throw error;
    }
};

const listLiveSessions = async (actor: Actor) => {
    return await pruneAbandoned(await sessionRepo.listLive(isAdmin(actor) ? undefined : actor.sub));
};

/** Resolves what the actor is in this session, or null if they have no place in it. */
const roleIn = (session: NonNullable<Awaited<ReturnType<typeof sessionRepo.findById>>>, actor: Actor): ParticipantRole | null => {
    // Membership first: an admin who teaches the class joins as its teacher.
    const member = session.members.find((m) => m.userId === actor.sub);
    if (member) return member.role;
    return isAdmin(actor) ? "ADMIN" : null;
};

const getJoinToken = async (sessionId: string, actor: Actor) => {
    const session = await sessionRepo.findById(sessionId);

    // Not a member reads as not found, so session ids can't be probed.
    const role = session ? roleIn(session, actor) : null;
    if (!session || !role) throw new SessionNotFoundError();

    if (session.status === "ENDED") throw new SessionEndedError();

    const token = await createJoinToken({
        roomName: session.id,
        identity: actor.sub,
        name: actor.username,
        role,
    });

    return {
        token,
        serverUrl: livekitUrl(),
        role,
        session: { id: session.id, className: session.className, startedAt: session.startedAt },
    };
};

const endSession = async (sessionId: string, actor: Actor) => {
    const session = await sessionRepo.findById(sessionId);

    const role = session ? roleIn(session, actor) : null;
    if (!session || !role) throw new SessionNotFoundError();
    if (role === "STUDENT") throw new ForbiddenError("Only the teacher or an admin can end the class.");

    const ended = await sessionRepo.endSession(sessionId);
    if (!ended) return;

    try {
        await closeRoom(sessionId);
    } catch (error) {
        // The session is already ended in the database, which is what decides
        // who can join. A room nobody ever entered doesn't exist in LiveKit,
        // and deleting it fails — that's fine either way.
        logger.warn({ err: error, sessionId }, "failed to close LiveKit room");
    }

    logger.info({ sessionId, by: actor.sub }, "class session ended");
};

export { endSession, getJoinToken, listLiveSessions, startSession };
