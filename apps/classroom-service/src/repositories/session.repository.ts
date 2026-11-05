import { MemberRole } from "../../prisma/generated";
import { prisma } from "../lib/prisma";

type MemberInput = { userId: string; username: string; role: MemberRole };

const sessionSummary = {
    id: true,
    classId: true,
    className: true,
    status: true,
    startedByUsername: true,
    startedAt: true,
    endedAt: true,
} as const;

const findLiveByClass = async (classId: string) => {
    return await prisma.classSession.findUnique({
        where: { liveClassId: classId },
        select: sessionSummary,
    });
};

const findById = async (id: string) => {
    return await prisma.classSession.findUnique({
        where: { id },
        include: { members: true },
    });
};

const createSession = async (data: {
    classId: string;
    className: string;
    startedByUserId: string;
    startedByUsername: string;
    members: MemberInput[];
}) => {
    const { members, ...session } = data;

    // Session and members in one write: a session without its member list
    // would be a room nobody can join.
    return await prisma.classSession.create({
        data: {
            ...session,
            liveClassId: session.classId,
            members: { create: members },
        },
        select: sessionSummary,
    });
};

/** Adds whoever isn't a member yet; existing members keep their row. */
const addMembers = async (sessionId: string, members: MemberInput[]) => {
    await prisma.sessionMember.createMany({
        data: members.map((m) => ({ ...m, sessionId })),
        skipDuplicates: true,
    });
};

/** Every live session for an admin; otherwise only those the user is a member of. */
const listLive = async (userId?: string) => {
    return await prisma.classSession.findMany({
        where: {
            status: "LIVE",
            ...(userId ? { members: { some: { userId } } } : {}),
        },
        orderBy: { startedAt: "desc" },
        select: sessionSummary,
    });
};

/** Returns false if it was already ended, so ending twice is harmless. */
const endSession = async (id: string): Promise<boolean> => {
    const { count } = await prisma.classSession.updateMany({
        where: { id, status: "LIVE" },
        // Clearing liveClassId frees the unique slot for the next session.
        data: { status: "ENDED", endedAt: new Date(), liveClassId: null },
    });
    return count > 0;
};

export { addMembers, createSession, endSession, findById, findLiveByClass, listLive };
