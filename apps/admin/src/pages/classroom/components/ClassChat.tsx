import { useConnectionState, useDataChannel } from "@livekit/components-react";
import { Button, Input, message, Space, Tag } from "antd";
import { ConnectionState } from "livekit-client";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import type { ChatMessage } from "../../../lib/types";
import { classroomApi } from "../../../services/api";
import { getApiErrorMessage } from "../../../services/errors";

const MAX_LENGTH = 2000;

/**
 * The same message can arrive from the history, the broadcast and the send
 * response, in any order, so everything goes through here: one copy per id,
 * in time order.
 */
const mergeMessages = (current: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] => {
    const byId = new Map([...current, ...incoming].map((m) => [m.id, m]));
    return [...byId.values()].sort((a, b) => a.sentAt.localeCompare(b.sentAt));
};

/** Must render inside LiveKitRoom: the broadcasts arrive on the room's connection. */
const ClassChat: React.FC<{ sessionId: string }> = ({ sessionId }) => {
    const { currentUser } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [draft, setDraft] = useState("");
    const [sending, setSending] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);
    const connectionState = useConnectionState();

    useDataChannel("chat", (packet) => {
        const received = JSON.parse(new TextDecoder().decode(packet.payload)) as ChatMessage;
        setMessages((current) => mergeMessages(current, [received]));
    });

    // On every connect, not just the first: broadcasts sent during a dropped
    // connection are gone, but they're saved, so the history fills the gap.
    useEffect(() => {
        if (connectionState !== ConnectionState.Connected) return;

        let cancelled = false;

        classroomApi.get<ChatMessage[]>(`/sessions/${sessionId}/messages`)
            .then(({ data }) => { if (!cancelled) setMessages((current) => mergeMessages(current, data)); })
            .catch((error) => { if (!cancelled) messageApi.error(getApiErrorMessage(error)); });

        return () => { cancelled = true; };
    }, [connectionState, sessionId, messageApi]);

    useEffect(() => {
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [messages]);

    const send = async (): Promise<void> => {
        if (!draft.trim() || sending) return;

        setSending(true);
        try {
            const { data } = await classroomApi.post<ChatMessage>(`/sessions/${sessionId}/messages`, { body: draft });
            setMessages((current) => mergeMessages(current, [data]));
            setDraft("");
        } catch (error) {
            messageApi.error(getApiErrorMessage(error));
        } finally {
            setSending(false);
        }
    };

    return (
        <div
            style={{
                width: 320,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                background: "var(--lk-bg2)",
                color: "var(--lk-fg)",
            }}
        >
            {contextHolder}
            <div ref={listRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 12 }}>
                {messages.map((m) => (
                    <div key={m.id} style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, opacity: 0.7 }}>
                            {m.senderUserId === currentUser?.userid ? "You" : m.senderUsername}
                            {m.senderRole !== "STUDENT" && (
                                <Tag color="blue" style={{ marginLeft: 6 }}>{m.senderRole.toLowerCase()}</Tag>
                            )}
                        </div>
                        <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{m.body}</div>
                    </div>
                ))}
            </div>
            <Space.Compact style={{ padding: 12 }}>
                <Input
                    placeholder="Message the class"
                    value={draft}
                    maxLength={MAX_LENGTH}
                    onChange={(e) => setDraft(e.target.value)}
                    onPressEnter={send}
                />
                <Button type="primary" loading={sending} disabled={!draft.trim()} onClick={send}>
                    Send
                </Button>
            </Space.Compact>
        </div>
    );
};

export default ClassChat;
