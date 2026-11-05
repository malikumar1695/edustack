import { PlusOutlined } from "@ant-design/icons";
import { ModalForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useEffect, useState, type FC } from "react";
import type { ClassListItem, UserListItem } from "../../../lib/types";
import { academicApi, authApi } from "../../../services/api";
import { getApiErrorMessage } from "../../../services/errors";

interface ClassFormProps {
    reload?: () => void;
    classItem?: ClassListItem;
    open?: boolean;
    onClose?: () => void;
}

type ClassFormState = {
    name: string;
    subject: string;
    teacherUserId: string;
};

const ClassForm: FC<ClassFormProps> = ({ reload, classItem, open, onClose }) => {
    const isEdit = Boolean(classItem);

    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState<UserListItem[]>([]);

    const loadTeachers = async () => {
        try {
            // Teachers live in auth-service; academic-service only stores the id
            // and a display copy of the username.
            const { data } = await authApi.get<{ data: UserListItem[] }>("/users", {
                params: { role: "teacher", pageSize: 100 },
            });
            setTeachers(data.data);
        } catch (error) {
            messageApi.error(getApiErrorMessage(error));
        }
    };

    // The edit modal mounts already open, so onOpenChange never fires for it.
    useEffect(() => {
        if (isEdit && open) loadTeachers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, open]);

    const submit = async (values: ClassFormState) => {
        const teacherUsername = teachers.find((t) => t.id === values.teacherUserId)?.username
            // The current teacher may have been deactivated and dropped out of
            // the list; keep the stored name rather than sending nothing.
            ?? classItem?.teacherUsername;

        const payload = { ...values, teacherUsername };

        if (isEdit) {
            await academicApi.put(`/classes/${classItem!.id}`, payload);
        } else {
            await academicApi.post("/classes", payload);
        }
    };

    return (
        <>
            {contextHolder}
            <ModalForm
                title={isEdit ? "Edit Class" : "Create Class"}
                open={isEdit ? open : undefined}
                onOpenChange={(visible) => {
                    if (visible && !isEdit) loadTeachers();
                    if (!visible) onClose?.();
                }}
                trigger={
                    isEdit ? undefined : (
                        <Button type="primary" icon={<PlusOutlined />}>
                            New
                        </Button>
                    )
                }
                initialValues={classItem}
                width="400px"
                modalProps={{ destroyOnClose: true, okButtonProps: { loading } }}
                onFinish={async (values) => {
                    setLoading(true);
                    try {
                        await submit(values as ClassFormState);
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
                    name="name"
                    label="Name"
                    placeholder="e.g. Grade 5 — Mathematics"
                    width="md"
                    rules={[
                        { required: true, message: "Name is required" },
                        { max: 64, message: "Name must be at most 64 characters" },
                    ]}
                />
                <ProFormText
                    name="subject"
                    label="Subject"
                    placeholder="e.g. Mathematics"
                    width="md"
                    rules={[
                        { required: true, message: "Subject is required" },
                        { max: 64, message: "Subject must be at most 64 characters" },
                    ]}
                />
                <ProFormSelect
                    name="teacherUserId"
                    label="Teacher"
                    width="md"
                    showSearch
                    placeholder="Select a teacher"
                    options={teachers.map((t) => ({ label: t.username, value: t.id }))}
                    rules={[{ required: true, message: "A teacher is required" }]}
                />
            </ModalForm>
        </>
    );
};

export default ClassForm;
