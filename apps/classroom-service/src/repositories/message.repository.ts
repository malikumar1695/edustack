import { ParticipantRole } from "../../prisma/generated";
import { prisma } from "../lib/prisma";

// Enough for any class; what's loaded when someone joins stays bounded.
const HISTORY_LIMIT = 500;

const createMessage = async (data: {
    sessionId: string;
    senderUserId: string;
    senderUsername: string;
    senderRole: ParticipantRole;
    body: string;
}) => {
    return await prisma.chatMessage.create({ data });
};

/** The latest messages of a session, oldest first. */
const listMessages = async (sessionId: string) => {
    const latest = await prisma.chatMessage.findMany({
        where: { sessionId },
        orderBy: { sentAt: "desc" },
        take: HISTORY_LIMIT,
    });
    return latest.reverse();
};

export { createMessage, listMessages };
