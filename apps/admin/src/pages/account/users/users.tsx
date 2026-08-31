import type {
  ActionType,
  ProColumns
} from "@ant-design/pro-components";
import {
  PageContainer,
  ProTable
} from "@ant-design/pro-components";
import { Button, message, Tag } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { authApi } from "../../../services/api";
import { getApiErrorMessage } from "../../../services/errors";
import { default as CreateForm, default as UserForm } from "./components/UserForm";

type UserListItem = {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  locked: boolean;
  roles: {
    role: { id: string, name: string };
  }[];
}

const Users: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [currentRow, setCurrentRow] = useState<UserListItem>();
  const [selectedRowsState, setSelectedRows] = useState<UserListItem[]>([]);
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {
      const res = await authApi.get("/users");
      const users = res.data;
      setUsers(users);
      actionRef.current?.reload?.();
    };
    fetchUsers();
  }, []);

  const columns: ProColumns<UserListItem>[] = [
    {
      title: "User Name",
      dataIndex: "username"
    },
    {
      title: "Roles",
      dataIndex: "roles",
      render: (_, record) => record.roles.map((r) => <Tag key={r.role.id}>{r.role.name}</Tag>),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      valueType: "dateTime",
      sorter: true,
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      valueType: "dateTime",
      sorter: true,
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
    }


  ];


  return (
    <PageContainer>
      {contextHolder}
      <ProTable<UserListItem, { current?: number; pageSize?: number }>
        headerTitle="Users"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <CreateForm key="create" reload={actionRef.current?.reload} />,
        ]}
        request={async () => {
          try {
            const res = await authApi.get("/users");
            return { data: res.data, success: true };
          } catch (error) {
            messageApi.error(getApiErrorMessage(error));
            return { data: [], success: false };
          }

        }}
        columns={columns} />

      {editingUser && (
        <UserForm
          key={editingUser.id}
          user={editingUser}
          open
          onClose={() => setEditingUser(null)}
          reload={actionRef.current?.reload}
        />
      )}
    </PageContainer>
  );
};

export default Users;
