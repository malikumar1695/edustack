import {
    ControlBar,
    GridLayout,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { PageContainer } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Result, Spin, Tag } from "antd";
import { DisconnectReason, Track } from "livekit-client";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { JoinTokenResponse } from "../../lib/types";
import { classroomApi } from "../../services/api";
import { getApiErrorMessage } from "../../services/errors";
import ClassChat from "./components/ClassChat";
import ClassTimer from "./components/ClassTimer";

const LIVE_CLASSES_PATH = "/live-classes";

/** Camera tiles for everyone, plus any screen share. */
const Stage: React.FC = () => {
    const tracks = useTracks(
        [
            // withPlaceholder: someone with their camera off still gets a tile.
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );

    return (
        <GridLayout tracks={tracks} style={{ height: "calc(100% - var(--lk-control-bar-height))" }}>
            <ParticipantTile />
        </GridLayout>
    );
};

const Classroom: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [join, setJoin] = useState<JoinTokenResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [ending, setEnding] = useState(false);
    // StrictMode mounts twice in development, and tearing down the first mount
    // fires onDisconnected before any connection was made. Only a disconnect
    // that follows a real connection means the user is out of the class.
    const connectedRef = useRef(false);

    useEffect(() => {
        let cancelled = false;

        classroomApi.post<JoinTokenResponse>(`/sessions/${sessionId}/token`)
            .then(({ data }) => { if (!cancelled) setJoin(data); })
            .catch((err) => { if (!cancelled) setError(getApiErrorMessage(err)); });

        return () => { cancelled = true; };
    }, [sessionId]);

    const endClass = async () => {
        setEnding(true);
        try {
            // Closes the LiveKit room server-side, which disconnects everyone —
            // including this page, whose onDisconnected then navigates away.
            await classroomApi.post(`/sessions/${sessionId}/end`);
        } catch (err) {
            messageApi.error(getApiErrorMessage(err));
            setEnding(false);
        }
    };

    if (error) {
        return (
            <Result
                status="warning"
                title="Can't join this class"
                subTitle={error}
                extra={<Button type="primary" onClick={() => navigate(LIVE_CLASSES_PATH)}>Back to live classes</Button>}
            />
        );
    }

    if (!join) {
        return (
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}>
                <Spin size="large" />
            </div>
        );
    }

    const canEnd = join.role !== "STUDENT";

    return (
        <PageContainer
            title={join.session.className}
            tags={[<Tag key="live" color="red">LIVE</Tag>, <ClassTimer key="timer" startedAt={join.session.startedAt} />]}
            extra={canEnd ? [
                <Popconfirm
                    key="end"
                    title="End class for everyone?"
                    description="All participants will be disconnected."
                    okText="End class"
                    okButtonProps={{ danger: true }}
                    onConfirm={endClass}
                >
                    <Button danger loading={ending}>End class</Button>
                </Popconfirm>,
            ] : []}
        >
            {contextHolder}
            <LiveKitRoom
                serverUrl={join.serverUrl}
                token={join.token}
                connect
                video
                audio
                data-lk-theme="default"
                style={{ height: "calc(100vh - 220px)", borderRadius: 8, overflow: "hidden" }}
                onConnected={() => { connectedRef.current = true; }}
                onDisconnected={(reason) => {
                    if (!connectedRef.current) return;
                    // The room is deleted when the teacher ends the class.
                    if (reason === DisconnectReason.ROOM_DELETED) message.info("The class has ended");
                    navigate(LIVE_CLASSES_PATH);
                }}
                onError={(err) => messageApi.error(err.message)}
            >
                <div style={{ display: "flex", height: "100%" }}>
                    <div style={{ flex: 1, minWidth: 0, height: "100%" }}>
                        <Stage />
                        {/* Remote audio plays here, independent of which tiles are visible. */}
                        <RoomAudioRenderer />
                        {/* ClassChat replaces LiveKit's built-in chat, which would vanish with the room. */}
                        <ControlBar controls={{ chat: false }} />
                    </div>
                    <ClassChat sessionId={join.session.id} />
                </div>
            </LiveKitRoom>
        </PageContainer>
    );
};

export default Classroom;
