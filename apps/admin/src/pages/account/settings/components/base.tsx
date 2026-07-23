import { UploadOutlined } from "@ant-design/icons";
import type { ProFormInstance } from "@ant-design/pro-components";
import {
  ProForm,
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { App, Button, Input, Upload } from "antd";
import React from "react";
import { useAuth } from "../../../../context/AuthContext";
import { getCityOptions, provinceOptions, type GeographicOption } from "../_mock";

const validatorPhone = (
  _rule: unknown,
  value: string[],
  callback: (message?: string) => void,
) => {
  if (!value[0]) {
    callback("Please input your area code!");
  }
  if (!value[1]) {
    callback("Please input your phone number!");
  }
  callback();
};

const toSelectValue = (item?: { label?: string; key?: string }) =>
  item?.key
    ? {
        label: item.label,
        value: item.key,
      }
    : undefined;

const toSelectOptions = (items: GeographicOption[]) =>
  items.map((item) => ({ label: item.label, value: item.key }));

export default function BaseView() {
  const { message } = App.useApp();
  const { currentUser } = useAuth();
  const formRef = React.useRef<ProFormInstance>(undefined);

  const handleFinish = async () => {
    message.success("Basic information updated successfully");
  };

  const handleValuesChange = (changedValues: Record<string, unknown>) => {
    if ("province" in changedValues) {
      formRef.current?.setFieldValue("city", undefined);
    }
  };

  const getAvatarURL = () => {
    if (currentUser?.avatar) {
      return currentUser.avatar;
    }
    return "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png";
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div style={{ display: "flex", paddingTop: 12 }}>
      <div style={{ minWidth: 224, maxWidth: 448 }}>
        <ProForm
          formRef={formRef}
          layout="vertical"
          onFinish={handleFinish}
          onValuesChange={handleValuesChange}
          submitter={{
            searchConfig: {
              submitText: "Update Basic Information",
            },
            render: (_, dom) => dom[1],
          }}
          initialValues={{
            ...currentUser,
            province: toSelectValue(currentUser?.geographic?.province),
            city: toSelectValue(currentUser?.geographic?.city),
            phone: currentUser?.phone?.split("-"),
          }}
          requiredMark={false}
        >
          <ProFormText
            width="md"
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          />
          <ProFormText
            width="md"
            name="name"
            label="Nickname"
            rules={[
              { required: true, message: "Please enter your nickname!" },
            ]}
          />
          <ProFormTextArea
            name="profile"
            label="Bio"
            rules={[{ required: true, message: "Please enter your bio!" }]}
            placeholder="Bio"
          />
          <ProFormSelect
            width="sm"
            name="country"
            label="Country/Region"
            rules={[
              {
                required: true,
                message: "Please enter your country or region!",
              },
            ]}
            options={[{ label: "China", value: "China" }]}
          />

          <ProForm.Group size={8}>
            <ProFormSelect
              label="Province/City"
              rules={[
                { required: true, message: "Please enter your province!" },
              ]}
              width="sm"
              fieldProps={{ labelInValue: true }}
              name="province"
              options={toSelectOptions(provinceOptions)}
            />
            <ProFormDependency name={["province"]}>
              {({ province }) => {
                return (
                  <ProFormSelect
                    label=" "
                    name="city"
                    width="sm"
                    rules={[
                      { required: true, message: "Please enter your city!" },
                    ]}
                    fieldProps={{ labelInValue: true }}
                    disabled={!province}
                    options={
                      province?.value
                        ? toSelectOptions(getCityOptions(String(province.value)))
                        : []
                    }
                  />
                );
              }}
            </ProFormDependency>
          </ProForm.Group>
          <ProFormText
            width="md"
            name="address"
            label="Street Address"
            rules={[
              {
                required: true,
                message: "Please enter your street address!",
              },
            ]}
          />
          <ProFormFieldSet
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter your phone number!" },
              { validator: validatorPhone },
            ]}
          >
            <Input style={{ width: 72 }} />
            <Input style={{ width: 214 }} />
          </ProFormFieldSet>
        </ProForm>
      </div>
      <div style={{ flex: 1, paddingLeft: 104 }}>
        <AvatarView avatar={getAvatarURL()} />
      </div>
    </div>
  );
}

const AvatarView = ({ avatar }: { avatar: string }) => {
  return (
    <>
      <div
        style={{
          height: 22,
          marginBottom: 8,
          fontSize: 14,
          lineHeight: "22px",
        }}
      >
        Avatar
      </div>
      <div style={{ width: 144, height: 144, marginBottom: 12, overflow: "hidden" }}>
        <img src={avatar} alt="avatar" style={{ width: "100%" }} />
      </div>
      <Upload showUploadList={false}>
        <div style={{ width: 144, textAlign: "center" }}>
          <Button>
            <UploadOutlined />
            Change Avatar
          </Button>
        </div>
      </Upload>
    </>
  );
};
