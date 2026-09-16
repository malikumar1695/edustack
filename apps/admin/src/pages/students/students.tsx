import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { getCountry } from "../../lib/constants";
import { Button, message, Popconfirm, Tag } from "antd";
import React, { useRef, useState } from "react";
import type { StudentListItem } from "../../lib/types";
import { useAuth } from "../../context/AuthContext";
import { academicApi } from "../../services/api";
import { getApiErrorMessage } from "../../services/errors";
import StudentForm from "./components/studentForm";
import LinkStudentUserForm from "./components/LinkStudentUserForm";

const Students: React.FC = () => {
    const actionRef = useRef<ActionType | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [editingStudent, setEditingStudent] = useState<StudentListItem | null>(null);
    const [linkingStudentUser, setLinkingStudentUser] = useState<StudentListItem | null>(null);
    const [pageSize, setPageSize] = useState(10);

    const { currentUser } = useAuth();
    const reloadTable = () => actionRef.current?.reload();

    const initiateDelete = async (record: StudentListItem): Promise<void> => {
        try {
            await academicApi.delete(`/students/${record.id}`);
            messageApi.success(`Student ${record.firstName} ${record.lastName} deleted successfully`);
            reloadTable();
        } catch (error) {
            messageApi.error(getApiErrorMessage(error));
        }
    };

    const initiateUnlinkUser = async (record: StudentListItem): Promise<void> => {
        try {
            await academicApi.delete(`/students/${record.id}/unlinkUser`);
            messageApi.success(`User unlinked from student ${record.firstName} ${record.lastName} successfully`);
            reloadTable();
        } catch (error) {
            messageApi.error(getApiErrorMessage(error));
        }
    };


    const columns: ProColumns<StudentListItem>[] = [
        {
            title: "Admission#",
            dataIndex: "admissionNo",
        },
        {
            title: "First Name",
            dataIndex: "firstName",
            render: (_, record) => `${record.firstName} ${record.lastName}`,
        },
        {
            title: "Guardian Name",
            dataIndex: "guardianName",
        },
        {
            title: "Guardian Phone",
            dataIndex: "guardianPhone",
        },
        {
            title: "Country of Residence",
            dataIndex: "countryOfResidence",
            render: (_, record) => <Tag>{getCountry(record.countryOfResidence)}</Tag>,
        },
        {
            title: "Updated",
            dataIndex: "updatedAt",
            valueType: "dateTime",
        },
        {
            title: "Login UserName",
            dataIndex: "userUsername",
            render: (_, r) => r.loginUsername
                ? <Tag color="blue">{r.loginUsername}</Tag>
                : <Tag>Not linked</Tag>,
        },
        {
            title: "Actions",
            valueType: "option",
            render: (_, record) => {
                const isSelf = record.id === currentUser?.userid;



                return [
                    <Button key="edit" type="link" onClick={() => setEditingStudent(record)}>
                        Edit
                    </Button>,
                    ...(isSelf
                        ? []
                        : [
                            <Popconfirm
                                key="delete"
                                title="Delete student"
                                description={`Delete "${record.firstName} ${record.lastName}"? This cannot be undone.`}
                                okText="Delete"
                                okButtonProps={{ danger: true }}
                                cancelText="Cancel"
                                onConfirm={() => initiateDelete(record)}
                            >
                                <Button type="link" danger>
                                    Delete
                                </Button>
                            </Popconfirm>,
                        ]),
                    <Button key="linkUser" type="link" onClick={() => setLinkingStudentUser(record)}>
                        {record.userId ? "Change User" : "Link User"}
                    </Button>,
                    ...(record.userId ? [
                        <Button key="unlinkUser" type="link" onClick={() => initiateUnlinkUser(record)}>
                            Unlink User
                        </Button>,
                    ] : []),
                ];
            },
        },
    ];

    return (
        <PageContainer>
            {contextHolder}
            <ProTable<StudentListItem>
                headerTitle="Students"
                actionRef={actionRef}
                rowKey="id"
                // No search form yet: auth-service has no filtering, so rendering
                // filter inputs would be a control that silently does nothing.
                search={false}
                pagination={{
                    pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    onShowSizeChange: (_, size) => setPageSize(size),
                }}
                toolBarRender={() => [<StudentForm key="create" reload={reloadTable} />]}
                request={async (params) => {
                    try {
                        const res = await academicApi.get("/students", {
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

            {editingStudent && (
                <StudentForm
                    key={editingStudent.id}
                    student={editingStudent}
                    open
                    onClose={() => setEditingStudent(null)}
                    reload={reloadTable}
                />
            )}
            {linkingStudentUser && (
                <LinkStudentUserForm
                    key={linkingStudentUser.id}
                    student={linkingStudentUser}
                    open
                    onClose={() => setLinkingStudentUser(null)}
                    reload={reloadTable}
                />
            )}
        </PageContainer>
    );
};

export default Students;

