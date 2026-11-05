import { ModalForm, ProFormSelect } from "@ant-design/pro-components";
import { Form, message } from "antd";
import { useEffect, useState, type FC } from "react";
import type { ClassDetail, ClassListItem, StudentListItem } from "../../../lib/types";
import { academicApi } from "../../../services/api";
import { getApiErrorMessage } from "../../../services/errors";

interface EnrollStudentsFormProps {
    classItem: ClassListItem;
    open: boolean;
    onClose: () => void;
    reload: () => void;
}

type EnrollStudentsFormState = {
    studentIds: string[];
};

const EnrollStudentsForm: FC<EnrollStudentsFormProps> = ({ classItem, open, onClose, reload }) => {
    const [form] = Form.useForm<EnrollStudentsFormState>();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<StudentListItem[]>([]);

    useEffect(() => {
        if (!open) return;

        const load = async () => {
            try {
                const [detailRes, studentsRes] = await Promise.all([
                    academicApi.get<ClassDetail>(`/classes/${classItem.id}`),
                    // 100 is the API's page-size cap. Past that this needs a
                    // server-side search instead of loading every student.
                    academicApi.get<{ data: StudentListItem[] }>("/students", {
                        params: { pageSize: 100 },
                    }),
                ]);

                setStudents(studentsRes.data.data);
                form.setFieldsValue({ studentIds: detailRes.data.students.map((s) => s.id) });
            } catch (error) {
                messageApi.error(getApiErrorMessage(error));
            }
        };

        load();
    }, [open, classItem.id, form, messageApi]);

    return (
        <>
            {contextHolder}
            <ModalForm<EnrollStudentsFormState>
                form={form}
                title={`Students in ${classItem.name}`}
                open={open}
                onOpenChange={(visible) => {
                    if (!visible) onClose();
                }}
                width="520px"
                modalProps={{ destroyOnClose: true, okButtonProps: { loading } }}
                onFinish={async ({ studentIds }) => {
                    setLoading(true);
                    try {
                        // The full roster, not a diff — the server makes the class
                        // match exactly this list.
                        await academicApi.put(`/classes/${classItem.id}/students`, { studentIds: studentIds ?? [] });
                        messageApi.success("Roster updated");
                        reload();
                        return true;
                    } catch (error) {
                        messageApi.error(getApiErrorMessage(error));
                        return false;
                    } finally {
                        setLoading(false);
                    }
                }}
            >
                <ProFormSelect
                    name="studentIds"
                    label="Students"
                    mode="multiple"
                    showSearch
                    placeholder="Select students"
                    fieldProps={{ optionFilterProp: "label" }}
                    options={students.map((s) => ({
                        label: `${s.firstName} ${s.lastName} (${s.admissionNo})`,
                        value: s.id,
                    }))}
                />
            </ModalForm>
        </>
    );
};

export default EnrollStudentsForm;
