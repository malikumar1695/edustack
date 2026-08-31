import { PlusOutlined } from "@ant-design/icons";
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  type ActionType
} from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useEffect, useMemo, useState, type FC } from "react";
import { authApi } from "../../../../services/api";
import { getApiErrorMessage } from "../../../../services/errors";

type UserListItem = {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  locked: boolean;
  roles: { role: { id: string, name: string } }[];
}


interface UserFormProps {
  reload?: () => void;
  user?: UserListItem;      // present = edit mode
  open?: boolean;
  onClose?: () => void;
}

type Role = {
  id: string;
  name: string;
};

type UserFormState = {
  username: string;
  password: string;
  roleIds: string[];
}


const UserForm: FC<UserFormProps> = (props) => {
  const { reload, user } = props;
  const isEdit = Boolean(user);

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

  useEffect(() => {
    authApi.get("/users/getroles").then(res => {
      const roles = res.data;
      setRoles(roles);
    });
  }, []);

  const roleOptions = useMemo(() => {
    return roles.map((role) => ({
      label: role.name,
      value: role.id,
    }));
  }, [roles]);


  const submit = async (values: UserFormState) => {
    if (isEdit) {
      await authApi.put(`/users/${user!.id}`, { roleIds: values.roleIds });
    } else {
      await authApi.post("/users", values);
    }
  };

  return (
    <>
      {contextHolder}
      <ModalForm
        title={isEdit ? "Edit User" : "Create User"}
        open={isEdit ? props.open : undefined}
        onOpenChange={(v) => { if (!v) props.onClose?.(); }}
        trigger={isEdit ? undefined : <Button type="primary" icon={<PlusOutlined />}>New</Button>}
        initialValues={isEdit ? { username: user!.username, roleIds: [] } : undefined}
        width="400px"
        modalProps={{ okButtonProps: { loading } }}
        onFinish={async (value) => {
          setLoading(true);
          try {
            await submit(value as UserFormState);
            messageApi.success(isEdit ? "Updated successfully" : "Added successfully");
            reload?.();
            return true;
          } catch (error) {
            messageApi.error(getApiErrorMessage(error));
            return false;
          } finally {
            setLoading(false);
          }
        }}
      >
        <ProFormText
          placeholder="Enter username"
          rules={[
            {
              required: true,
              message: "Username is required",
            },
          ]}
          width="md"
          name="username"
        />
        <ProFormText
          placeholder="Enter password"
          rules={[
            {
              required: true,
              message: "Password is required",
            },
          ]}
          width="md"
          name="password"
        />
        <ProFormSelect
          name="roleIds"
          mode="multiple"
          width="md"
          label="Roles"
          rules={[
            {
              required: true,
              message: "At least one role is required",
            },
          ]}
          fieldProps={{
            onChange: (value: string[], option) => {
              const selectedRoles = roles.filter((role) => value.includes(role.id));
              setSelectedRoles(selectedRoles);
            }
          }}
          options={roleOptions}
        />

      </ModalForm>
    </>
  );
};

export default UserForm;
