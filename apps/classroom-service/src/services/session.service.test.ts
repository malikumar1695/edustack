import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemberRole, Prisma } from "../../prisma/generated";
import { ForbiddenError, SessionEndedError, SessionNotFoundError } from "../errors/AppError";
import { getClassRoster } from "../lib/academic";
import { closeRoom, createJoinToken, listActiveRooms } from "../lib/livekit";
import * as sessionRepo from "../repositories/session.repository";
import * as sessionService from "./session.service";


vi.mock("../lib/prisma", () => ({ prisma: {} }));
vi.mock("../repositories/session.repository");
vi.mock("../lib/academic");
vi.mock("../lib/livekit", () => ({
    createJoinToken: vi.fn(),
    closeRoom: vi.fn(),
    listActiveRooms: vi.fn(),
    livekitUrl: () => "wss://test.livekit.cloud",
}));


const admin = { sub: "admin-1", username: "admin", roles: ["admin"] };
const teacher = { sub: "teacher-1", username: "mr.khan", roles: ["teacher"] };
const student = { sub: "student-1", username: "saqib", roles: ["student"] };
const outsider = { sub: "student-9", username: "zara", roles: ["student"] };

const roster = {
    id: "class-1",
    name: "Grade 5 — Mathematics",
    teacherUserId: teacher.sub,
    teacherUsername: teacher.username,
    students: [
        { id: "s1", userId: student.sub, loginUsername: student.username },
        // No linked login account — has nothing to join with.
        { id: "s2", userId: null, loginUsername: null },
    ],
};

const summary = {
    id: "session-1",
    classId: roster.id,
    className: roster.name,
    status: "LIVE" as const,
    startedByUsername: teacher.username,
    startedAt: new Date(),
    endedAt: null,
};

const storedSession = (status: "LIVE" | "ENDED" = "LIVE") => ({
    ...summary,
    status,
    liveClassId: status === "LIVE" ? roster.id : null,
    startedByUserId: teacher.sub,
    members: [
        { sessionId: summary.id, userId: teacher.sub, username: teacher.username, role: MemberRole.TEACHER },
        { sessionId: summary.id, userId: student.sub, username: student.username, role: MemberRole.STUDENT },
    ],
});

beforeEach(() => {
    vi.resetAllMocks();
});

describe("start session", () => {

    it("should snapshot the teacher and linked students as members", async () => {
        vi.mocked(getClassRoster).mockResolvedValue(roster);
        vi.mocked(sessionRepo.findLiveByClass).mockResolvedValue(null);
        vi.mocked(sessionRepo.createSession).mockResolvedValue(summary);

        await sessionService.startSession(roster.id, teacher, "Bearer t");

        expect(sessionRepo.createSession).toHaveBeenCalledWith(expect.objectContaining({
            classId: roster.id,
            className: roster.name,
            startedByUserId: teacher.sub,
            members: expect.arrayContaining([
                { userId: teacher.sub, username: teacher.username, role: MemberRole.TEACHER },
                { userId: student.sub, username: student.username, role: MemberRole.STUDENT },
            ]),
        }));
        expect(vi.mocked(sessionRepo.createSession).mock.calls[0][0].members).toHaveLength(2);
    });

    it("should report enrolled students who have no login account", async () => {
        vi.mocked(getClassRoster).mockResolvedValue(roster);
        vi.mocked(sessionRepo.findLiveByClass).mockResolvedValue(null);
        vi.mocked(sessionRepo.createSession).mockResolvedValue(summary);

        await expect(sessionService.startSession(roster.id, teacher, "Bearer t"))
            .resolves.toMatchObject({ unlinkedStudents: 1 });
    });

    it("should return the live session instead of opening a second room", async () => {
        vi.mocked(getClassRoster).mockResolvedValue(roster);
        vi.mocked(sessionRepo.findLiveByClass).mockResolvedValue(summary);

        await expect(sessionService.startSession(roster.id, teacher, "Bearer t"))
            .resolves.toEqual({ ...summary, unlinkedStudents: 1 });
        expect(sessionRepo.createSession).not.toHaveBeenCalled();
    });

    it("should add students enrolled after the session started when started again", async () => {
        const lateStudent = { id: "s3", userId: "student-3", loginUsername: "hina" };
        vi.mocked(getClassRoster).mockResolvedValue({ ...roster, students: [...roster.students, lateStudent] });
        vi.mocked(sessionRepo.findLiveByClass).mockResolvedValue(summary);

        await sessionService.startSession(roster.id, teacher, "Bearer t");

        expect(sessionRepo.addMembers).toHaveBeenCalledWith(summary.id, expect.arrayContaining([
            { userId: "student-3", username: "hina", role: MemberRole.STUDENT },
        ]));
    });

    it("should check access with academic-service before revealing a live session", async () => {
        vi.mocked(getClassRoster).mockRejectedValue(new Error("Class not found"));
        vi.mocked(sessionRepo.findLiveByClass).mockResolvedValue(summary);

        await expect(sessionService.startSession(roster.id, teacher, "Bearer t")).rejects.toThrow();
        expect(sessionRepo.findLiveByClass).not.toHaveBeenCalled();
    });

    it("should join the winner when a concurrent start takes the live slot", async () => {
        vi.mocked(getClassRoster).mockResolvedValue(roster);
        vi.mocked(sessionRepo.findLiveByClass)
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(summary);
        vi.mocked(sessionRepo.createSession).mockRejectedValue(
            new Prisma.PrismaClientKnownRequestError("unique", { code: "P2002", clientVersion: "test" }),
        );

        await expect(sessionService.startSession(roster.id, teacher, "Bearer t"))
            .resolves.toMatchObject({ id: summary.id });
        expect(sessionRepo.addMembers).toHaveBeenCalledWith(summary.id, expect.any(Array));
    });
});

describe("abandoned sessions", () => {
    // Older than the grace period, so its room is expected to exist.
    const yesterday = { ...summary, startedAt: new Date(Date.now() - 24 * 60 * 60_000) };

    it("should end a session whose room is gone and start a fresh one", async () => {
        vi.mocked(getClassRoster).mockResolvedValue(roster);
        vi.mocked(sessionRepo.findLiveByClass).mockResolvedValue(yesterday);
        vi.mocked(listActiveRooms).mockResolvedValue(new Set());
        vi.mocked(sessionRepo.createSession).mockResolvedValue({ ...summary, id: "session-2" });

        await expect(sessionService.startSession(roster.id, teacher, "Bearer t"))
            .resolves.toMatchObject({ id: "session-2" });
        expect(sessionRepo.endSession).toHaveBeenCalledWith(yesterday.id);
        expect(sessionRepo.addMembers).not.toHaveBeenCalled();
    });

    it("should keep an old session whose room still has people in it", async () => {
        vi.mocked(getClassRoster).mockResolvedValue(roster);
        vi.mocked(sessionRepo.findLiveByClass).mockResolvedValue(yesterday);
        vi.mocked(listActiveRooms).mockResolvedValue(new Set([yesterday.id]));

        await expect(sessionService.startSession(roster.id, teacher, "Bearer t"))
            .resolves.toMatchObject({ id: yesterday.id });
        expect(sessionRepo.endSession).not.toHaveBeenCalled();
        expect(sessionRepo.createSession).not.toHaveBeenCalled();
    });

    it("should not ask LiveKit about a session that just started", async () => {
        vi.mocked(sessionRepo.listLive).mockResolvedValue([summary]);

        await expect(sessionService.listLiveSessions(student)).resolves.toEqual([summary]);
        expect(listActiveRooms).not.toHaveBeenCalled();
    });

    it("should drop abandoned sessions from the live list", async () => {
        vi.mocked(sessionRepo.listLive).mockResolvedValue([yesterday]);
        vi.mocked(listActiveRooms).mockResolvedValue(new Set());

        await expect(sessionService.listLiveSessions(student)).resolves.toEqual([]);
        expect(sessionRepo.endSession).toHaveBeenCalledWith(yesterday.id);
    });

    it("should keep sessions live when LiveKit can't be reached", async () => {
        vi.mocked(sessionRepo.listLive).mockResolvedValue([yesterday]);
        vi.mocked(listActiveRooms).mockRejectedValue(new Error("network"));

        await expect(sessionService.listLiveSessions(student)).resolves.toEqual([yesterday]);
        expect(sessionRepo.endSession).not.toHaveBeenCalled();
    });
});

describe("join token", () => {

    it("should issue a student token for a member", async () => {
        vi.mocked(sessionRepo.findById).mockResolvedValue(storedSession());
        vi.mocked(createJoinToken).mockResolvedValue("jwt");

        const result = await sessionService.getJoinToken(summary.id, student);

        expect(result).toMatchObject({ token: "jwt", role: "STUDENT", serverUrl: "wss://test.livekit.cloud" });
        expect(result.session.startedAt).toEqual(summary.startedAt);
        expect(createJoinToken).toHaveBeenCalledWith({
            roomName: summary.id, identity: student.sub, name: student.username, role: "STUDENT",
        });
    });

    it("should let an admin join any session as ADMIN", async () => {
        vi.mocked(sessionRepo.findById).mockResolvedValue(storedSession());
        vi.mocked(createJoinToken).mockResolvedValue("jwt");

        await expect(sessionService.getJoinToken(summary.id, admin)).resolves.toMatchObject({ role: "ADMIN" });
    });

    it("should report a session the user isn't in as not found", async () => {
        vi.mocked(sessionRepo.findById).mockResolvedValue(storedSession());

        await expect(sessionService.getJoinToken(summary.id, outsider)).rejects.toThrow(SessionNotFoundError);
        expect(createJoinToken).not.toHaveBeenCalled();
    });

    it("should refuse to issue a token for an ended session", async () => {
        vi.mocked(sessionRepo.findById).mockResolvedValue(storedSession("ENDED"));

        await expect(sessionService.getJoinToken(summary.id, student)).rejects.toThrow(SessionEndedError);
    });
});

describe("end session", () => {

    it("should end the session and close the room for its teacher", async () => {
        vi.mocked(sessionRepo.findById).mockResolvedValue(storedSession());
        vi.mocked(sessionRepo.endSession).mockResolvedValue(true);

        await sessionService.endSession(summary.id, teacher);

        expect(sessionRepo.endSession).toHaveBeenCalledWith(summary.id);
        expect(closeRoom).toHaveBeenCalledWith(summary.id);
    });

    it("should not let a student end the class", async () => {
        vi.mocked(sessionRepo.findById).mockResolvedValue(storedSession());

        await expect(sessionService.endSession(summary.id, student)).rejects.toThrow(ForbiddenError);
        expect(sessionRepo.endSession).not.toHaveBeenCalled();
    });

    it("should still succeed when LiveKit has no room to close", async () => {
        vi.mocked(sessionRepo.findById).mockResolvedValue(storedSession());
        vi.mocked(sessionRepo.endSession).mockResolvedValue(true);
        vi.mocked(closeRoom).mockRejectedValue(new Error("room not found"));

        await expect(sessionService.endSession(summary.id, admin)).resolves.toBeUndefined();
    });
});
