import { PlusOutlined } from "@ant-design/icons";
import {
  type ActionType,
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useState, type FC } from "react";
import { addRule, type RuleListItem } from "../mockData";

interface CreateFormProps {
  reload?: ActionType["reload"];
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const { reload } = props;

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  return (
    <>
      {contextHolder}
      <ModalForm
        title="New rule"
        trigger={
          <Button type="primary" icon={<PlusOutlined />}>
            New
          </Button>
        }
        width="400px"
        modalProps={{ okButtonProps: { loading } }}
        onFinish={async (value) => {
          setLoading(true);
          try {
            await addRule(value as RuleListItem);
            messageApi.success("Added successfully");
            reload?.();
            return true;
          } catch {
            messageApi.error("Adding failed, please try again!");
            return false;
          } finally {
            setLoading(false);
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: "Rule name is required",
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
    </>
  );
};

export default CreateForm;
