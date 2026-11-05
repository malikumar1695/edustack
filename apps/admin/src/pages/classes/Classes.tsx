import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Tag } from "antd";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { ClassListItem, StartSessionResponse } from "../../lib/types";
import { academicApi, classroomApi } from "../../services/api";
import { getApiErrorMessage } from "../../services/errors";
import ClassForm from "./components/ClassForm";
import ClassStudentsDrawer from "./components/ClassStudentsDrawer";
import EnrollStudentsForm from "./components/EnrollStudentsForm";

const Classes: React.FC = () => {
    const actionRef = useRef<ActionType | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [editingClass, setEditingClass] = useState<ClassListItem | null>(null);
    const [enrollingClass, setEnrollingClass] = useState<ClassListItem | null>(null);
    const [viewingClass, setViewingClass] = useState<ClassListItem | null>(null);
    const [pageSize, setPageSize] = useState(10);
    const [startingClassId, setStartingClassId] = useState<string | null>(null);
    const navigate = useNavigate();

    // Teachers see their own classes and can start them, but not edit them.
    // Students see the classes they're enrolled in and join from Live Classes.
    // This only hides the buttons — the services enforce it regardless.
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.access === "admin";
    const canStart = isAdmin || currentUser?.access === "teacher";

    const reloadTable = () => actionRef.current?.reload();

    const startClass = async (record: ClassListItem): Promise<void> => {
        setStartingClassId(record.id);
        try {
            // Returns the existing session if the class is already live, so
            // this doubles as "rejoin".
            const { data } = await classroomApi.post<StartSessionResponse>("/sessions", { classId: record.id });
            if (data.unlinkedStudents > 0) {
                // message.warning, not messageApi: this page unmounts on navigate.
                message.warning(
                    `${data.unlinkedStudents} enrolled student(s) have no login account linked and can't join. ` +
                    "Link an account on the Students page, then press Start class again.",
                    8,
                );
            }
            navigate(`/classroom/${data.id}`);
        } catch (error) {
            messageApi.error(getApiErrorMessage(error));
            setStartingClassId(null);
        }
    };

    const initiateDelete = async (record: ClassListItem): Promise<void> => {
        try {
            await academicApi.delete(`/classes/${record.id}`);
            messageApi.success(`Class ${record.name} deleted successfully`);
            reloadTable();
        } catch (error) {
            messageApi.error(getApiErrorMessage(error));
        }
    };

    const columns: ProColumns<ClassListItem>[] = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Subject",
            dataIndex: "subject",
        },
        {
            title: "Teacher",
            dataIndex: "teacherUsername",
            render: (_, record) => <Tag color="blue">{record.teacherUsername}</Tag>,
        },
        {
            title: "Students",
            dataIndex: "studentCount",
            // Not sent to students; the column would only be empty.
            hideInTable: !canStart,
            render: (_, record) => (
                <Button
                    type="link"
                    style={{ padding: 0 }}
                    onClick={() => setViewingClass(record)}
                >
                    {record.studentCount}
                </Button>
            ),
        },
        {
            title: "Updated",
            dataIndex: "updatedAt",
            valueType: "dateTime",
        },
        {
            title: "Actions",
            valueType: "option",
            // Students have nothing to do here; they join from Live Classes.
            hideInTable: !canStart,
            render: (_, record) => [
                ...(canStart ? [
                    <Button
                        key="start"
                        type="link"
                        loading={startingClassId === record.id}
                        onClick={() => startClass(record)}
                    >
                        Start class
                    </Button>,
                ] : []),
                ...(isAdmin ? [
                    <Button key="edit" type="link" onClick={() => setEditingClass(record)}>
                        Edit
                    </Button>,
                    <Button key="students" type="link" onClick={() => setEnrollingClass(record)}>
                        Students
                    </Button>,
                    <Popconfirm
                        key="delete"
                        title="Delete class"
                        description={`Delete "${record.name}"? This cannot be undone.`}
                        okText="Delete"
                        okButtonProps={{ danger: true }}
                        cancelText="Cancel"
                        onConfirm={() => initiateDelete(record)}
                    >
                        <Button type="link" danger>
                            Delete
                        </Button>
                    </Popconfirm>,
                ] : []),
            ],
        },
    ];

    return (
        <PageContainer>
            {contextHolder}
            <ProTable<ClassListItem>
                headerTitle="Classes"
                actionRef={actionRef}
                rowKey="id"
                // No search form yet: academic-service has no filtering.
                search={false}
                pagination={{
                    pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    onShowSizeChange: (_, size) => setPageSize(size),
                }}
                toolBarRender={() => isAdmin ? [<ClassForm key="create" reload={reloadTable} />] : []}
                request={async (params) => {
                    try {
                        const res = await academicApi.get("/classes", {
                            params: { current: params.current, pageSize: params.pageSize },
                        });
                        return { data: res.data.data, total: res.data.total, success: true };
                    } catch (error) {
                        messageApi.error(getApiErrorMessage(error));
                        return { data: [], total: 0, success: false };
                    }
                }}
                columns={columns}
            />

            {editingClass && (
                <ClassForm
                    key={editingClass.id}
                    classItem={editingClass}
                    open
                    onClose={() => setEditingClass(null)}
                    reload={reloadTable}
                />
            )}
            {viewingClass && (
                <ClassStudentsDrawer
                    key={viewingClass.id}
                    classItem={viewingClass}
                    open
                    onClose={() => setViewingClass(null)}
                    reload={reloadTable}
                />
            )}
            {enrollingClass && (
                <EnrollStudentsForm
                    key={enrollingClass.id}
                    classItem={enrollingClass}
                    open
                    onClose={() => setEnrollingClass(null)}
                    reload={reloadTable}
                />
            )}
        </PageContainer>
    );
};

export default Classes;
