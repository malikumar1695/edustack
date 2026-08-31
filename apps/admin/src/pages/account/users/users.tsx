import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message, Tag } from "antd";
import React, { useRef, useState } from "react";
import { authApi } from "../../../services/api";
import { getApiErrorMessage } from "../../../services/errors";
import UserForm from "./components/UserForm";
import type { UserListItem } from "./types";

const Users: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);

  const reloadTable = () => actionRef.current?.reload();

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
      title: "Status",
      dataIndex: "locked",
      render: (_, record) =>
        record.locked ? <Tag color="red">Locked</Tag> : <Tag color="green">Active</Tag>,
    },
    {
      title: "Actions",
      valueType: "option",
      render: (_, record) => [
        <Button key="edit" type="link" onClick={() => setEditingUser(record)}>
          Edit
        </Button>,
      ],
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
