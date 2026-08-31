import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Tag } from "antd";
import React, { useRef, useState } from "react";
import { authApi } from "../../../services/api";
import { getApiErrorMessage } from "../../../services/errors";
import UserForm from "./components/UserForm";
import type { UserListItem } from "./types";
import { useAuth } from "../../../context/AuthContext";

const Users: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const [pageSize, setPageSize] = useState(10);

  const { currentUser } = useAuth();
  const reloadTable = () => actionRef.current?.reload();

  const initiateDelete = async (record: UserListItem): Promise<void> => {
    try {
      await authApi.delete(`/users/${record.id}`);
      messageApi.success(`User ${record.username} deleted successfully`);
      reloadTable();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    }
  };


  const unlockUser = async (record: UserListItem) => {
    try {
      await authApi.post(`/users/${record.id}/unlock`);
      messageApi.success(`${record.username} unlocked`);
      reloadTable();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    }
  };


  const columns: ProColumns<UserListItem>[] = [
    {
      title: "User Name",
      dataIndex: "username",
    },
    {
      title: "Roles",
      dataIndex: "roles",
      render: (_, record) => record.roles.map((role) => <Tag key={role.id}>{role.name}</Tag>),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      valueType: "dateTime",
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      valueType: "dateTime",
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      render: (_, record) =>
        record.isActive ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: "Locked",
      dataIndex: "locked",
      render: (_, record) =>
        record.locked ? <Tag color="orange">Locked</Tag> : <Tag>—</Tag>,
    },
    {
      title: "Actions",
      valueType: "option",
      render: (_, record) => {
        const isSelf = record.id === currentUser?.userid;

        return [
          ...(record.locked
            ? [
              <Button key="unlock" type="link" onClick={() => unlockUser(record)}>
                Unlock
              </Button>,
            ]
            : []),
          <Button key="edit" type="link" onClick={() => setEditingUser(record)}>
            Edit
          </Button>,
          ...(isSelf
            ? []
            : [
              <Popconfirm
                key="delete"
                title="Delete user"
                description={`Delete "${record.username}"? This cannot be undone.`}
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
        ];
      },
    },
  ];

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<UserListItem>
        headerTitle="Users"
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
        toolBarRender={() => [<UserForm key="create" reload={reloadTable} />]}
        request={async (params) => {
          try {
            const res = await authApi.get("/users", {
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

      {editingUser && (
        <UserForm
          key={editingUser.id}
          user={editingUser}
          open
          onClose={() => setEditingUser(null)}
          reload={reloadTable}
        />
      )}
    </PageContainer>
  );
};

export default Users;

