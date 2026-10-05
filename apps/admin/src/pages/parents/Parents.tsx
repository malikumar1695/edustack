import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Tag } from "antd";
import React, { useRef, useState } from "react";
import LinkUserForm from "../../components/LinkUserForm";
import { getCountry } from "../../lib/constants";
import type { ParentListItem } from "../../lib/types";
import { academicApi } from "../../services/api";
import { getApiErrorMessage } from "../../services/errors";
import ParentForm from "./components/ParentForm";

const Parents: React.FC = () => {
    const actionRef = useRef<ActionType | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [editingParent, setEditingParent] = useState<ParentListItem | null>(null);
    const [linkingParentUser, setLinkingParentUser] = useState<ParentListItem | null>(null);
    const [pageSize, setPageSize] = useState(10);

    const reloadTable = () => actionRef.current?.reload();

    const initiateDelete = async (record: ParentListItem): Promise<void> => {
        try {
            await academicApi.delete(`/parents/${record.id}`);
            messageApi.success(`Parent ${record.firstName} ${record.lastName} deleted successfully`);
            reloadTable();
        } catch (error) {
            messageApi.error(getApiErrorMessage(error));
        }
    };

    const initiateUnlinkUser = async (record: ParentListItem): Promise<void> => {
        try {
            await academicApi.delete(`/parents/${record.id}/user`);
            messageApi.success(`User unlinked from parent ${record.firstName} ${record.lastName} successfully`);
            reloadTable();
        } catch (error) {
            messageApi.error(getApiErrorMessage(error));
        }
    };

    const columns: ProColumns<ParentListItem>[] = [
        {
            title: "Name",
            dataIndex: "firstName",
            render: (_, record) => `${record.firstName} ${record.lastName}`,
        },
        {
            title: "Phone",
            dataIndex: "phone",
        },
        {
            title: "Email",
            dataIndex: "email",
            render: (_, record) => record.email || <Tag>None</Tag>,
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
            dataIndex: "loginUsername",
            render: (_, r) => r.loginUsername
                ? <Tag color="blue">{r.loginUsername}</Tag>
                : <Tag>Not linked</Tag>,
        },
        {
            title: "Actions",
            valueType: "option",
            render: (_, record) => [
                <Button key="edit" type="link" onClick={() => setEditingParent(record)}>
                    Edit
                </Button>,
                <Popconfirm
                    key="delete"
                    title="Delete parent"
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
                <Button key="linkUser" type="link" onClick={() => setLinkingParentUser(record)}>
                    {record.userId ? "Change User" : "Link User"}
                </Button>,
                ...(record.userId ? [
                    <Popconfirm
                        key="unlinkUser"
                        title="Unlink User"
                        description={`Unlink user "${record.loginUsername}"? This cannot be undone.`}
                        okText="Unlink"
                        okButtonProps={{ danger: true }}
                        cancelText="Cancel"
                        onConfirm={() => initiateUnlinkUser(record)}
                    >
                        <Button variant="link" color="orange">
                            Unlink User
                        </Button>
                    </Popconfirm>,
                ] : []),
            ],
        },
    ];

    return (
        <PageContainer>
            {contextHolder}
            <ProTable<ParentListItem>
                headerTitle="Parents"
                actionRef={actionRef}
                rowKey="id"
                // No search form yet: academic-service has no filtering, so rendering
                // filter inputs would be a control that silently does nothing.
                search={false}
                pagination={{
                    pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    onShowSizeChange: (_, size) => setPageSize(size),
                }}
                toolBarRender={() => [<ParentForm key="create" reload={reloadTable} />]}
                request={async (params) => {
                    try {
                        const res = await academicApi.get("/parents", {
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

            {editingParent && (
                <ParentForm
                    key={editingParent.id}
                    parent={editingParent}
                    open
                    onClose={() => setEditingParent(null)}
                    reload={reloadTable}
                />
            )}
            {linkingParentUser && (
                <LinkUserForm
                    key={linkingParentUser.id}
                    record={linkingParentUser}
                    resource="parents"
                    roleName="parents"
                    noun="Parent"
                    open
                    onClose={() => setLinkingParentUser(null)}
                    reload={reloadTable}
                />
            )}
        </PageContainer>
    );
};

export default Parents;
