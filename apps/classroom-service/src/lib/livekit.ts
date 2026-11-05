import { AccessToken, DataPacket_Kind, RoomServiceClient } from "livekit-server-sdk";
import { ParticipantRole } from "../../prisma/generated";

const requireEnv = (name: string): string => {
    const value = process.env[name];
    if (!value) throw new Error(`${name} is not set. Add it to apps/classroom-service/.env.`);
    return value;
};

/** The wss:// URL browsers connect to. */
export const livekitUrl = () => requireEnv("LIVEKIT_URL");

// Long enough to load the page and connect; it only governs joining — an
// established connection outlives it. Short, because a leaked token is a
// ticket into a room full of children.
const JOIN_TOKEN_TTL = "10m";

export const createJoinToken = async (params: {
    roomName: string;
    identity: string;
    name: string;
    role: ParticipantRole;
}): Promise<string> => {
    const token = new AccessToken(requireEnv("LIVEKIT_API_KEY"), requireEnv("LIVEKIT_API_SECRET"), {
        // The auth-service user id: stable, and what transcripts and chat
        // will be attributed to.
        identity: params.identity,
        name: params.name,
        ttl: JOIN_TOKEN_TTL,
        // Readable by every participant, so the UI can badge the teacher.
        metadata: JSON.stringify({ role: params.role }),
    });

    token.addGrant({
        room: params.roomName,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
        // Off: chat goes through this service, so a browser publishing straight
        // into the room could post messages that were never saved.
        canPublishData: false,
        // Mute or remove others. Teachers and admins, never students.
        roomAdmin: params.role !== "STUDENT",
    });

    return await token.toJwt();
};

let roomService: RoomServiceClient | undefined;

const getRoomService = () => {
    // The server API is plain HTTPS on the same host as the wss:// endpoint.
    roomService ??= new RoomServiceClient(
        livekitUrl().replace(/^wss:/, "https:").replace(/^ws:/, "http:"),
        requireEnv("LIVEKIT_API_KEY"),
        requireEnv("LIVEKIT_API_SECRET"),
    );
    return roomService;
};

/**
 * Which of these rooms exist in LiveKit right now. LiveKit deletes a room
 * a few minutes after the last participant leaves, so a missing room means
 * nobody is in the class.
 */
export const listActiveRooms = async (roomNames: string[]): Promise<Set<string>> => {
    const rooms = await getRoomService().listRooms(roomNames);
    return new Set(rooms.map((room) => room.name));
};

/** Delivers a saved chat message to everyone in the room, sender included. */
export const broadcastChatMessage = async (roomName: string, message: unknown): Promise<void> => {
    const payload = new TextEncoder().encode(JSON.stringify(message));
    await getRoomService().sendData(roomName, payload, DataPacket_Kind.RELIABLE, { topic: "chat" });
};

/** Disconnects everyone still in the room. */
export const closeRoom = async (roomName: string): Promise<void> => {
    await getRoomService().deleteRoom(roomName);
};
