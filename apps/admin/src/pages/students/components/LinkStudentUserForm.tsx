import { PlusOutlined } from "@ant-design/icons";
import { ModalForm, ProForm, ProFormDatePicker, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Button, Col, Form, message, Row } from "antd";
import { useState, useEffect } from "react";
import type { StudentListItem, UserListItem } from "../../../lib/types";
import { getApiErrorMessage } from "../../../services/errors";
import UserFormFields from "../../account/users/components/UserFormFields";
import { academicApi, authApi } from "../../../services/api";
import { RoleName } from "@ilm/auth-kit";

type LinkStudentUserFormProps = {
    student: StudentListItem;
    open: boolean;
    onClose: () => void;
    reload: () => void;
};

type LinkStudentFormState = {
    userId?: string;
    username: string;
    password: string;
    role: RoleName;
}

const STUDENT_ROLE: RoleName = "student";

const LinkStudentUserForm = ({ student, open, onClose, reload }: LinkStudentUserFormProps) => {

    const [messageApi, messageApiContextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [unlinkedUsers, setUnlinkedUsers] = useState<UserListItem[]>([]);
    const [isCreateUserClicked, setIsCreateUserClicked] = useState(false);
    const [users, setUsers] = useState<UserListItem[]>([]);

    const fetchUnlinkedUsers = async () => {
        const [users, linkedUsers] = await Promise.all([
            authApi.get<UserListItem[]>(`/users/findUserByRole?roleName=${STUDENT_ROLE}`),
            academicApi.get<string[]>(`/students/linkedUserIds`)
        ]);
        setUsers(users.data);
        const takenByOthers = linkedUsers.data.filter(id => id !== student.userId);
        setUnlinkedUsers(users.data.filter((user: UserListItem) => !takenByOthers.includes(user.id)));
    };

    useEffect(() => {
        if (open) {
            fetchUnlinkedUsers();
        }
    }, [open]);

    const submit = async (values: LinkStudentFormState) => {
        const { userId } = values;

        let linkedUserId = userId;
        if (!linkedUserId) {
            const clean = Object.fromEntries(
                Object.entries(values).filter(([, v]) => v !== undefined && v !== null && v !== ""),
            );
            const res = await authApi.post("/users/linkUser", { ...clean, role: STUDENT_ROLE });
            linkedUserId = res.data.id;
        }

        const loginUsername = users.find(user => user.id === userId)?.username;
        await academicApi.put(`/students/${student.id}/linkUserToStudent`, { userId: linkedUserId, loginUsername });

        messageApi.success("Linked successfully");
        reload?.();
        return true;
    };

    return (
        <>
            {messageApiContextHolder}
            <ModalForm
                title={"Link Student User"}
                open={open}
                onOpenChange={(visible) => {
                    if (!visible) {
                        setIsCreateUserClicked(false);
                        onClose?.();
                    }
                }}
                width="400px"
                modalProps={{ destroyOnClose: true, okButtonProps: { loading } }}
                initialValues={{ userId: student.userId , username: users.find(user => user.id === student.userId)?.username }}
                onFinish={async (values) => {
                    setLoading(true);
                    try {
                        return await submit(values as LinkStudentFormState);
                    } catch (error) {
                        setLoading(false);
                        messageApi.error(getApiErrorMessage(error));
                        return false;
                    } finally {
                        setLoading(false);
                    }
                }}
            >
                <Row gutter={8}>
                    <Col span={16}>
                        <ProFormSelect
                            name="userId"
                            mode="single"
                            label="User"
                            placeholder="Select a user"
                            options={unlinkedUsers.map((user) => ({ label: user.username, value: user.id }))}
                            rules={[{ required: !isCreateUserClicked, message: "A user is required" }]}
                        />
                    </Col>
                    <Col span={8}>
                        <Form.Item label=" " >            {/* invisible label = vertical alignment */}
                            <Button
                                type="primary"
                                block                                   // stretch to column width
                                onClick={() => {
                                    setIsCreateUserClicked(!isCreateUserClicked);
                                }}
                            >
                                Create New User
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>

                {isCreateUserClicked && <UserFormFields isEdit={false} />}
            </ModalForm>
        </>
    );
};

export default LinkStudentUserForm;