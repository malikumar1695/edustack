import { Button, Drawer, message, Popconfirm, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState, type FC } from "react";
import type { ClassDetail, ClassListItem, ClassStudent, StudentListItem } from "../../../lib/types";
import { academicApi } from "../../../services/api";
import { getApiErrorMessage } from "../../../services/errors";

interface ClassStudentsDrawerProps {
    classItem: ClassListItem;
    open: boolean;
    onClose: () => void;
    reload: () => void;
}

const ClassStudentsDrawer: FC<ClassStudentsDrawerProps> = ({ classItem, open, onClose, reload }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [students, setStudents] = useState<ClassStudent[]>([]);
    const [allStudents, setAllStudents] = useState<StudentListItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;

        let cancelled = false;

        Promise.all([
            academicApi.get<ClassDetail>(`/classes/${classItem.id}`),
            // 100 is the API's page-size cap. Past that this needs a
            // server-side search instead of loading every student.
            academicApi.get<{ data: StudentListItem[] }>("/students", { params: { pageSize: 100 } }),
        ])
            .then(([detailRes, studentsRes]) => {
                if (cancelled) return;
                setStudents(detailRes.data.students);
                setAllStudents(studentsRes.data.data);
            })
            .catch((error) => { if (!cancelled) messageApi.error(getApiErrorMessage(error)); })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [open, classItem.id, messageApi]);

    /** The API answers 204, so the list here is updated from what was sent. */
    const saveChange = async (
        request: () => Promise<unknown>,
        applyChange: (current: ClassStudent[]) => ClassStudent[],
        successMessage: string,
    ): Promise<boolean> => {
        setSaving(true);
        try {
            await request();
            setStudents(applyChange);
            messageApi.success(successMessage);
            // The count in the table behind this drawer.
            reload();
            return true;
        } catch (error) {
            messageApi.error(getApiErrorMessage(error));
            return false;
        } finally {
            setSaving(false);
        }
    };

    const addSelected = async (): Promise<void> => {
        const added = allStudents.filter((s) => selectedIds.includes(s.id));

        const saved = await saveChange(
            () => academicApi.post(`/classes/${classItem.id}/students`, { studentIds: selectedIds }),
            (current) => [...current, ...added],
            "Students added",
        );
        // On failure the selection stays, ready to retry.
        if (saved) setSelectedIds([]);
    };

    const removeStudent = (student: ClassStudent): Promise<boolean> => saveChange(
        () => academicApi.delete(`/classes/${classItem.id}/students/${student.id}`),
        (current) => current.filter((s) => s.id !== student.id),
        `${student.firstName} ${student.lastName} removed`,
    );

    const rosterIdSet = new Set(students.map((s) => s.id));

    const columns: ColumnsType<ClassStudent> = [
        {
            title: "Name",
            render: (_, student) => `${student.firstName} ${student.lastName}`,
        },
        {
            title: "Admission no.",
            dataIndex: "admissionNo",
        },
        {
            title: "Login",
            // A student without a login is enrolled but can't join a live class.
            render: (_, student) => student.loginUsername
                ? <Tag color="blue">{student.loginUsername}</Tag>
                : <Tag color="warning">No login</Tag>,
        },
        {
            title: "Actions",
            render: (_, student) => (
                <Popconfirm
                    title="Remove student"
                    description={`Remove ${student.firstName} ${student.lastName} from ${classItem.name}?`}
                    okText="Remove"
                    okButtonProps={{ danger: true }}
                    cancelText="Cancel"
                    onConfirm={() => removeStudent(student)}
                >
                    <Button type="link" danger style={{ padding: 0 }}>Remove</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <>
            {contextHolder}
            <Drawer
                title={`Students in ${classItem.name}`}
                size="large"
                closable={{ placement: "end" }}
                open={open}
                onClose={onClose}
            >
                <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
                    <Select
                        mode="multiple"
                        showSearch
                        optionFilterProp="label"
                        placeholder="Select students to add"
                        style={{ width: "100%" }}
                        value={selectedIds}
                        onChange={setSelectedIds}
                        disabled={saving}
                        options={allStudents
                            .filter((s) => !rosterIdSet.has(s.id))
                            .map((s) => ({
                                label: `${s.firstName} ${s.lastName} (${s.admissionNo})`,
                                value: s.id,
                            }))}
                    />
                    <Button
                        type="primary"
                        loading={saving}
                        disabled={selectedIds.length === 0}
                        onClick={addSelected}
                    >
                        Add
                    </Button>
                </Space.Compact>
                <Table<ClassStudent>
                    rowKey="id"
                    size="small"
                    loading={loading || saving}
                    pagination={false}
                    columns={columns}
                    dataSource={students}
                />
            </Drawer>
        </>
    );
};

export default ClassStudentsDrawer;
