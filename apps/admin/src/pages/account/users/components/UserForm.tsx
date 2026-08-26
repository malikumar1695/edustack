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

interface UserFormProps {
  reload?: ActionType["reload"];
}

type Role = {
  id: string;
  name: string;
  permissions: { id: string; name: string }[];
};

type UserFormState = {
  username: string;
  password: string;
  roles: Role[];
}


const UserForm: FC<UserFormProps> = (props) => {
  const { reload } = props;

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
      permissions: role.permissions.map((p) => ({ id: p.id, name: p.name })),
    }));
  }, [roles]);

  const permissionOptions = useMemo(() => {
    const byId = new Map<string, string>();
    for (const role of selectedRoles) {
      for (const permission of role.permissions) {
        byId.set(permission.id, permission.name);
      }
    }
    return Array.from(byId, ([value, label]) => ({ label, value }));

  }, [selectedRoles]);


  const addUser = async (user: UserFormState) => {

  }

  return (
    <>
      {contextHolder}
      <ModalForm
        title="Create User"
        trigger={
          <Button type="primary" icon={<PlusOutlined />}>
            New
          </Button>
        }
        width="400px"
        modalProps={{ okButtonProps: { loading } }}
        onFinish={async (value) => {
          setLoading(true);
          try {
            await addUser(value as UserFormState);
            messageApi.success("Added successfully");
            reload?.();
            return true;
          } catch {
            messageApi.error("Adding failed, please try again!");
            return false;
          } finally {
            setLoading(false);
          }
        }}
      >
        <ProFormText
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
          name="roles"
          mode="multiple"
          width="md"
          label="Roles"
          fieldProps={{
            onChange: (value: string[], option) => {
              const selectedRoles = roles.filter((role) => value.includes(role.id));
              setSelectedRoles(selectedRoles);
            }
          }}
          options={roleOptions}
        />
        <ProFormSelect
          name="permissions"
          mode="multiple"
          width="md"
          label="Permissions"
          options={permissionOptions}
        />
      </ModalForm>
    </>
  );
};

export default UserForm;
