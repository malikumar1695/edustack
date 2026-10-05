import { PlusOutlined } from "@ant-design/icons";
import { ModalForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Button, Form, Input, message, Select, Space } from "antd";
import parsePhoneNumberFromString, { CountryCode, getCountries, getCountryCallingCode } from "libphonenumber-js";
import { useState, type FC } from "react";
import { COUNTRY_OPTIONS, GENDER_OPTIONS } from "../../../lib/constants";
import type { ParentListItem } from "../../../lib/types";
import { academicApi } from "../../../services/api";
import { getApiErrorMessage } from "../../../services/errors";

interface ParentFormProps {
    reload?: () => void;
    parent?: ParentListItem;
    open?: boolean;
    onClose?: () => void;
}

type ParentFormState = {
    firstName: string;
    lastName: string;
    email?: string;
    gender: string;
    phone: string;
    phoneCountry: string;
    countryOfResidence: string;
};

const ParentForm: FC<ParentFormProps> = ({ reload, parent, open, onClose }) => {
    const isEdit = Boolean(parent);

    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    const submit = async (values: ParentFormState) => {
        const payload = {
            ...values,
            // The form holds the national number and the country separately so
            // the inputs stay usable; the API only ever sees E.164.
            phone: `+${getCountryCallingCode(values.phoneCountry as CountryCode)}${values.phone.replace(/[\s-]/g, "")}`,
        };

        if (isEdit) {
            await academicApi.put(`/parents/${parent!.id}`, payload);
        } else {
            await academicApi.post("/parents", payload);
        }
    };

    return (
        <>
            {contextHolder}
            <ModalForm
                title={isEdit ? "Edit Parent" : "Create Parent"}
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
                    if (!parent) return undefined;

                    const parsed = parsePhoneNumberFromString(parent.phone || "");
                    return {
                        ...parent,
                        phone: parsed?.nationalNumber || "",
                        phoneCountry: parsed?.country || "",
                    };
                })()}
                width="400px"
                modalProps={{ destroyOnClose: true, okButtonProps: { loading } }}
                onFinish={async (values) => {
                    setLoading(true);
                    try {
                        await submit(values as ParentFormState);
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
                    name="firstName"
                    label="First Name"
                    placeholder="Enter first name"
                    width="md"
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
                    rules={[
                        { required: true, message: "Last name is required" },
                        { min: 3, max: 64, message: "Last name must be between 3 and 64 characters" },
                    ]}
                />

                <ProFormText
                    name="email"
                    label="Email"
                    placeholder="Enter email address"
                    width="md"
                    // Optional, matching the column — but it's where notifications
                    // will be sent, so it has to be a real address when present.
                    rules={[{ type: "email", message: "Enter a valid email address" }]}
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

                <Form.Item
                    label="Phone"
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
                            name="phone"
                            noStyle
                            rules={[
                                { required: true, message: "Phone number is required" },
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

export default ParentForm;
