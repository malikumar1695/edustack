import { PlusOutlined } from "@ant-design/icons";
import { ModalForm, ProFormDatePicker, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useState, useEffect } from "react";
import type { StudentListItem, UserListItem } from "../../../lib/types";
import { getApiErrorMessage } from "../../../services/errors";
import UserFormFields from "../../account/users/components/UserFormFields";
import { authApi } from "../../../services/api";
import type { RoleName } from "../../../../../../packages/auth-kit/src/roles";


type LinkStudentUserFormProps = {
    student: StudentListItem;
    open: boolean;
    onClose: () => void;
    reload: () => void;
};

type LinkStudentFormState = {
    username: string;
    password: string;
}

const STUDENT_ROLE: RoleName = "student";

const LinkStudentUserForm = ({ student, open, onClose, reload }: LinkStudentUserFormProps) => {

    const [messageApi, messageApiContextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [unlinkedUsers, setUnlinkedUsers] = useState<UserListItem[]>([]);

    const fetchUnlinkedUsers = async () => {
        setUnlinkedUsers((await authApi.get(`/users/unlinkedUsers?roleName=${STUDENT_ROLE}`)).data);
    };

    useEffect(() => {
        if (open) {
            fetchUnlinkedUsers();
        }
    }, [open]);

    const submit = async (values: LinkStudentFormState) => {
        // Implement the API call to link the student user here
    };

    return (
        <>
            {messageApiContextHolder}
            <ModalForm
                title={"Link Student User"}
                open={open}
                onOpenChange={(visible) => {
                    if (!visible) onClose?.();
                }}
                width="400px"
                modalProps={{ destroyOnClose: true, okButtonProps: { loading } }}
                onFinish={async (values) => {
                    setLoading(true);
                    try {
                        await submit(values as LinkStudentFormState);
                        messageApi.success("Linked successfully");
                        reload?.();
                        return true;
                    } catch (error) {
                        setLoading(false);
                        messageApi.error(getApiErrorMessage(error));
                        return false;
                    } finally {
                        setLoading(false);
                    }
                }}
            >
                <ProFormSelect
                    name="roleId"
                    mode="single"
                    width="md"
                    label="Role"
                    placeholder="Select a role"
                    options={unlinkedUsers.map((user) => ({ label: user.username, value: user.id }))}
                    rules={[{ required: true, message: "A role is required" }]}
                />
                <UserFormFields isEdit={false} />
            </ModalForm>
        </>
    );
};

export default LinkStudentUserForm;