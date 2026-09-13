import { PlusOutlined } from "@ant-design/icons";
import { ModalForm, ProFormDatePicker, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Button, Form, Input, message, Select, Space } from "antd";
import parsePhoneNumberFromString, { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { useState, type FC } from "react";
import { useAuth } from "../../../context/AuthContext";
import { COUNTRY_OPTIONS, GENDER_OPTIONS } from "../../../lib/constants";
import { StudentListItem } from "../../../lib/types";
import { academicApi } from "../../../services/api";
import { getApiErrorMessage } from "../../../services/errors";

interface StudentFormProps {
    reload?: () => void;
    student?: StudentListItem;
    open?: boolean;
    onClose?: () => void;
}

type StudentFormState = {
    admissionNo: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    guardianName: string;
    guardianPhone: string;
    phoneCountry: string;
    countryOfResidence: string;
};

const StudentForm: FC<StudentFormProps> = ({ reload, student, open, onClose }) => {
    const isEdit = Boolean(student);

    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    const { currentUser } = useAuth();


    const submit = async (values: StudentFormState) => {
        const payload = {
            ...values,
            guardianPhone: `+${AsYouType(values.phoneCountry)}${values.guardianPhone.replace(/[\s-]/g, "")}`,
        };
        if (isEdit) {
            await academicApi.put(`/students/${student!.id}`, payload);
        } else {
            await academicApi.post("/students", payload);
        }
    };

    return (
        <>
            {contextHolder}
            <ModalForm
                title={isEdit ? "Edit Student" : "Create Student"}
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
                initialValues={(() => {
                    const phoneNumberWithoutPrefixCode = parsePhoneNumberFromString(student?.guardianPhone || "");
                    return student ? {
                        ...student,
                        guardianPhone: phoneNumberWithoutPrefixCode?.nationalNumber || "",
                        phoneCountry: phoneNumberWithoutPrefixCode?.country || "",
                    } : undefined;
                })()}
                width="400px"
                modalProps={{ destroyOnClose: true, okButtonProps: { loading } }}
                onFinish={async (values) => {
                    setLoading(true);
                    try {
                        await submit(values as StudentFormState);
                        messageApi.success(isEdit ? "Updated successfully" : "Added successfully");
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
                <ProFormText
                    name="firstName"
                    label="First Name"
                    placeholder="Enter first name"
                    width="md"
                    disabled={isEdit}
                    rules={[
                        { required: true, message: "First name is required" },
                        { min: 3, max: 64, message: "First name must be between 3 and 64 characters" },
                    ]}
                />
                <ProFormText
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter last name"
                    width="md"
                    disabled={isEdit}
                    rules={[
                        { required: true, message: "Last name is required" },
                        { min: 3, max: 64, message: "Last name must be between 3 and 64 characters" },
                    ]}
                />
                <ProFormDatePicker
                    name="dateOfBirth"
                    width="md"
                    label="Date of Birth"
                    placeholder="Select date of birth"
                    rules={[{ required: true, message: "Date of birth is required" }]}
                />
                <ProFormSelect
                    name="gender"
                    mode="single"
                    width="md"
                    label="Gender"
                    placeholder="Select gender"
                    options={GENDER_OPTIONS}
                    rules={[{ required: true, message: "Gender is required" }]}
                />
                <ProFormText
                    name="guardianName"
                    label="Guardian Name"
                    placeholder="Enter guardian name"
                    width="md"
                    disabled={isEdit}
                    rules={[
                        { required: true, message: "Guardian name is required" },
                        { min: 3, max: 64, message: "Guardian name must be between 3 and 64 characters" },
                    ]}
                />

                <Form.Item
                    label="Guardian Phone"
                    required
                    style={{ width: 328 /* matches width="md" */ }}
                >
                    <Space.Compact style={{ width: "100%" }}>
                        <Form.Item
                            name="phoneCountry"
                            noStyle
                            initialValue="PK"
                            rules={[{ required: true, message: "Country is required" }]}
                        >
                            <Select
                                style={{ width: 130 }}
                                showSearch
                                optionFilterProp="label"
                                options={getCountries().map((code) => ({
                                    label: `${code} +${getCountryCallingCode(code)}`,
                                    value: code,
                                }))}
                            />
                        </Form.Item>
                        <Form.Item
                            name="guardianPhone"
                            noStyle
                            rules={[
                                { required: true, message: "Guardian phone is required" },
                                { pattern: /^[0-9\s-]{6,15}$/, message: "Enter digits only" },
                            ]}
                        >
                            <Input placeholder="1712345678" />
                        </Form.Item>
                    </Space.Compact>
                </Form.Item>
                <ProFormSelect
                    name="countryOfResidence"
                    mode="single"
                    width="md"
                    label="Country of Residence"
                    placeholder="Select country of residence"
                    fieldProps={{
                        showSearch: true,
                        optionFilterProp: "label",
                    }}
                    options={COUNTRY_OPTIONS}
                    rules={[{ required: true, message: "Country of residence is required" }]}
                />
            </ModalForm>
        </>
    );
};

export default StudentForm;
