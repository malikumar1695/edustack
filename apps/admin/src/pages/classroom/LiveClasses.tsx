import type { ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message, Tag } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import type { ClassSession } from "../../lib/types";
import { classroomApi } from "../../services/api";
import { getApiErrorMessage } from "../../services/errors";
import ClassTimer from "./components/ClassTimer";

// Fast enough that a student waiting for class sees it appear, slow enough
// not to matter for the rate limiter.
const POLL_INTERVAL_MS = 15_000;

const LiveClasses: React.FC = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const columns: ProColumns<ClassSession>[] = [
        {
            title: "Class",
            dataIndex: "className",
        },
        {
            title: "Started by",
            dataIndex: "startedByUsername",
            render: (_, record) => <Tag color="blue">{record.startedByUsername}</Tag>,
        },
        {
            title: "Running for",
            dataIndex: "startedAt",
            render: (_, record) => <ClassTimer startedAt={record.startedAt} />,
        },
        {
            title: "Actions",
            valueType: "option",
            render: (_, record) => [
                <Button key="join" type="primary" onClick={() => navigate(`/classroom/${record.id}`)}>
                    Join
                </Button>,
            ],
        },
    ];

    return (
        <PageContainer>
            {contextHolder}
            <ProTable<ClassSession>
                headerTitle="Live classes"
                rowKey="id"
                search={false}
                pagination={false}
                polling={POLL_INTERVAL_MS}
                // Admins see every live class; everyone else only the ones they
                // belong to — classroom-service decides, not this page.
                request={async () => {
                    try {
                        const { data } = await classroomApi.get<ClassSession[]>("/sessions/live");
                        return { data, total: data.length, success: true };
                    } catch (error) {
                        messageApi.error(getApiErrorMessage(error));
                        return { data: [], total: 0, success: false };
                    }
                }}
                columns={columns}
            />
        </PageContainer>
    );
};

export default LiveClasses;
