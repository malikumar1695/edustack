import { PlusOutlined } from "@ant-design/icons";
import { ModalForm, ProFormSelect, ProFormSwitch, ProFormText } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useEffect, useMemo, useState, type FC } from "react";
import { authApi } from "../../../../services/api";
import { getApiErrorMessage } from "../../../../services/errors";
import { useAuth } from "../../../../context/AuthContext";
import type { Role, UserListItem } from "../../../../lib/types";
import UserFormFields from "./UserFormFields";

interface UserFormProps {
  reload?: () => void;
  user?: UserListItem;
  open?: boolean;
  onClose?: () => void;
}

type UserFormState = {
  isActive: boolean;
  username: string;
  password: string;
  roleIds: string[];
};

const UserForm: FC<UserFormProps> = ({ reload, user, open, onClose }) => {
  const isEdit = Boolean(user);

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const { currentUser } = useAuth();

  useEffect(() => {
    authApi
      .get("/roles")
      .then((res) => setRoles(res.data))
      .catch((error) => messageApi.error(getApiErrorMessage(error)));
  }, [messageApi]);

  const roleOptions = useMemo(
    () => roles.map((role) => ({ label: role.name, value: role.id })),
    [roles],
  );

  const submit = async (values: UserFormState) => {
    if (isEdit) {
      await authApi.put(`/users/${user!.id}`, { isActive: values.isActive, roleIds: values.roleIds });
    } else {
      await authApi.post("/users", values);
    }
  };

  return (
    <>
      {contextHolder}
      <ModalForm
        title={isEdit ? "Edit User" : "Create User"}
        open={isEdit ? open : undefined}
        onOpenChange={(visible) => {
          if (!visible) onClose?.();
        }}
        trigger={
          isEdit ? undefined : (
            <Button type="primary" icon={<PlusOutlined />}>
              New
            </Button>
          )
        }
        initialValues={
          isEdit
            ? {
              username: user!.username,
              roleIds: user!.roles.map((role) => role.id),
              isActive: user!.isActive,
            }
            : undefined
        }
        width="400px"
        modalProps={{ destroyOnClose: true, okButtonProps: { loading } }}
        onFinish={async (values) => {
          setLoading(true);
          try {
            await submit(values as UserFormState);
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
        <UserFormFields isEdit={isEdit} />
        <ProFormSwitch
          label="Is Active"
          name="isActive"
          disabled={isEdit && user!.id === currentUser?.userid}
          initialValue={true}
        />
        <ProFormSelect
          name="roleIds"
          mode="multiple"
          width="md"
          label="Roles"
          placeholder="Select one or more roles"
          options={roleOptions}
          rules={[{ required: true, message: "At least one role is required" }]}
        />
      </ModalForm>
    </>
  );
};

export default UserForm;
