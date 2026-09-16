import { ModalForm, ProFormSelect } from "@ant-design/pro-components";
import { Button, Col, Form, message, Row } from "antd";
import { useEffect, useMemo, useState } from "react";
import type { Role, StudentListItem, UserListItem } from "../../../lib/types";
import { academicApi, authApi } from "../../../services/api";
import { getApiErrorMessage } from "../../../services/errors";
import UserFormFields from "../../account/users/components/UserFormFields";
import type { RoleName } from "@ilm/auth-kit";
type LinkStudentUserFormProps = {
    student: StudentListItem;
    open: boolean;
    onClose: () => void;
    reload: () => void;
};

type LinkStudentFormState = {
    userId?: string;
    username?: string;
    password?: string;
};

const STUDENT_ROLE: RoleName = "student";

const LinkStudentUserForm = ({ student, open, onClose, reload }: LinkStudentUserFormProps) => {
    const [messageApi, messageApiContextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [isCreatingUser, setIsCreatingUser] = useState(false);

    const [users, setUsers] = useState<UserListItem[]>([]);
    const [linkedUserIds, setLinkedUserIds] = useState<string[]>([]);
    const [studentRoleId, setStudentRoleId] = useState<string>();

    useEffect(() => {
        if (!open) return;

        const load = async () => {
            try {
                // Each service answers only about its own data; the client composes.
                // "Which accounts are free?" spans both, so it can't be one query.
                const [userRes, linkedRes, roleRes] = await Promise.all([
                    authApi.get<{ data: UserListItem[] }>("/users", {
                        params: { role: STUDENT_ROLE, pageSize: 100 },
                    }),
                    academicApi.get<string[]>("/students/linked-user-ids"),
                    authApi.get<Role[]>("/roles"),
                ]);

                setUsers(userRes.data.data);
                setLinkedUserIds(linkedRes.data);
                setStudentRoleId(roleRes.data.find((role) => role.name === STUDENT_ROLE)?.id);
            } catch (error) {
                messageApi.error(getApiErrorMessage(error));
            }
        };

        load();
    }, [open, messageApi]);

    const userOptions = useMemo(() => {
        // Exclude accounts taken by OTHER students — this student's own stays in
        // the list so the Select can render it as the current selection.
        const takenByOthers = linkedUserIds.filter((id) => id !== student.userId);

        return users
            .filter((user) => !takenByOthers.includes(user.id))
            .map((user) => ({ label: user.username, value: user.id }));
    }, [users, linkedUserIds, student.userId]);

    const submit = async (values: LinkStudentFormState) => {
        let userId = values.userId;
        let loginUsername = users.find((user) => user.id === userId)?.username;

        if (!userId) {
            if (!studentRoleId) throw new Error("Student role is unavailable — try reopening the dialog.");

            const { data: created } = await authApi.post<{ id: string; username: string }>("/users", {
                username: values.username,
                password: values.password,
                roleIds: [studentRoleId],
                isActive: true,
            });

            // Read both back from the response — `values.userId` is undefined on
            // this path, so looking it up in `users` would store a null username.
            userId = created.id;
            loginUsername = created.username;
        }

        await academicApi.put(`/students/${student.id}/user`, { userId, loginUsername });

        messageApi.success("Linked successfully");
        reload?.();
        return true;
    };

    return (
        <>
            {messageApiContextHolder}
            <ModalForm
                title={student.userId ? "Change Student Login" : "Link Student Login"}
                open={open}
                onOpenChange={(visible) => {
                    if (!visible) {
                        setIsCreatingUser(false);
                        onClose?.();
                    }
                }}
                width="400px"
                initialValues={{ userId: student.userId }}
                modalProps={{ destroyOnClose: true, okButtonProps: { loading } }}
                onFinish={async (values) => {
                    setLoading(true);
                    try {
                        return await submit(values as LinkStudentFormState);
                    } catch (error) {
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
                            label="User"
                            showSearch
                            placeholder="Select an account"
                            disabled={isCreatingUser}
                            options={userOptions}
                            rules={[{ required: !isCreatingUser, message: "A user is required" }]}
                        />
                    </Col>
                    <Col span={8}>
                        <Form.Item label=" ">{/* invisible label = vertical alignment */}
                            <Button block onClick={() => setIsCreatingUser((v) => !v)}>
                                {isCreatingUser ? "Select existing" : "Create new"}
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>

                {isCreatingUser && <UserFormFields isEdit={false} />}
            </ModalForm>
        </>
    );
};

export default LinkStudentUserForm;
