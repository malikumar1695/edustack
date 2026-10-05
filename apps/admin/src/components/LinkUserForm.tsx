import { ModalForm, ProFormSelect } from "@ant-design/pro-components";
import { Button, Col, Form, message, Row } from "antd";
import { useEffect, useMemo, useState } from "react";
import type { RoleName } from "../lib/constants";
import type { LinkableRecord, Role, UserListItem } from "../lib/types";
import { academicApi, authApi } from "../services/api";
import { getApiErrorMessage } from "../services/errors";
import UserFormFields from "../pages/account/users/components/UserFormFields";

type LinkUserFormProps = {
    /** The record being linked — only its id and current userId matter here. */
    record: LinkableRecord;
    /** academic-service collection the record belongs to. */
    resource: "students" | "parents";
    /** auth-service role the linked account must hold. */
    roleName: RoleName;
    /** Singular noun used in the dialog copy, e.g. "Student". */
    noun: string;
    open: boolean;
    onClose: () => void;
    reload: () => void;
};

type LinkUserFormState = {
    userId?: string;
    username?: string;
    password?: string;
};

/**
 * Students and parents both link to a User in auth-service through the same
 * flow, so this is shared rather than duplicated per page. Everything that
 * differs is a prop: the collection, the role, and the noun.
 */
const LinkUserForm = ({ record, resource, roleName, noun, open, onClose, reload }: LinkUserFormProps) => {
    const [messageApi, messageApiContextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [isCreatingUser, setIsCreatingUser] = useState(false);

    const [users, setUsers] = useState<UserListItem[]>([]);
    const [linkedUserIds, setLinkedUserIds] = useState<string[]>([]);
    const [roleId, setRoleId] = useState<string>();

    useEffect(() => {
        if (!open) return;

        const load = async () => {
            try {
                // Each service answers only about its own data; the client composes.
                // "Which accounts are free?" spans both, so it can't be one query.
                const [userRes, linkedRes, roleRes] = await Promise.all([
                    authApi.get<{ data: UserListItem[] }>("/users", {
                        params: { role: roleName, pageSize: 100 },
                    }),
                    academicApi.get<string[]>(`/${resource}/linked-user-ids`),
                    authApi.get<Role[]>("/roles"),
                ]);

                setUsers(userRes.data.data);
                setLinkedUserIds(linkedRes.data);
                setRoleId(roleRes.data.find((role) => role.name === roleName)?.id);
            } catch (error) {
                messageApi.error(getApiErrorMessage(error));
            }
        };

        load();
    }, [open, resource, roleName, messageApi]);

    const userOptions = useMemo(() => {
        // Exclude accounts taken by OTHER records — this one's own stays in the
        // list so the Select can render it as the current selection.
        const takenByOthers = linkedUserIds.filter((id) => id !== record.userId);

        return users
            .filter((user) => !takenByOthers.includes(user.id))
            .map((user) => ({ label: user.username, value: user.id }));
    }, [users, linkedUserIds, record.userId]);

    const submit = async (values: LinkUserFormState) => {
        let userId = values.userId;
        let loginUsername = users.find((user) => user.id === userId)?.username;

        if (!userId) {
            if (!roleId) throw new Error(`The ${roleName} role is unavailable — try reopening the dialog.`);

            const { data: created } = await authApi.post<{ id: string; username: string }>("/users", {
                username: values.username,
                password: values.password,
                roleIds: [roleId],
                isActive: true,
            });

            // Read both back from the response — `values.userId` is undefined on
            // this path, so looking it up in `users` would store a null username.
            userId = created.id;
            loginUsername = created.username;
        }

        await academicApi.put(`/${resource}/${record.id}/user`, { userId, loginUsername });

        messageApi.success("Linked successfully");
        reload?.();
        return true;
    };

    return (
        <>
            {messageApiContextHolder}
            <ModalForm
                title={record.userId ? `Change ${noun} Login` : `Link ${noun} Login`}
                open={open}
                onOpenChange={(visible) => {
                    if (!visible) {
                        setIsCreatingUser(false);
                        onClose?.();
                    }
                }}
                width="400px"
                initialValues={{ userId: record.userId }}
                modalProps={{ destroyOnClose: true, okButtonProps: { loading } }}
                onFinish={async (values) => {
                    setLoading(true);
                    try {
                        return await submit(values as LinkUserFormState);
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

export default LinkUserForm;
