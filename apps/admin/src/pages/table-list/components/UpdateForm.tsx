import {
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from "@ant-design/pro-components";
import { Modal, message } from "antd";
import React, { cloneElement, useCallback, useState } from "react";
import { updateRule, type RuleListItem } from "../mockData";

type UpdateFormProps = {
  trigger?: React.ReactElement<any>;
  onOk?: () => void;
  values: Partial<RuleListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { onOk, values, trigger } = props;

  const [open, setOpen] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  // NOTE: StepsForm's onFinish only reports values for fields actually
  // bound to a form item, so `values.key` (not bound to any input) never
  // came through here. Merging the original `values` prop back in keeps
  // the update matched to the right row — the original demo's mock had
  // the same gap, it just happened not to matter since it kept every rule
  // in one shared in-memory array anyway.
  const onFinish = useCallback(
    async (formValues?: Record<string, any>) => {
      try {
        await updateRule({ ...values, ...formValues, key: values?.key });
        messageApi.success("Configuration is successful");
        onOk?.();
      } catch {
        messageApi.error("Configuration failed, please try again!");
      }
      onCancel();
    },
    [values, onOk, onCancel, messageApi],
  );

  return (
    <>
      {contextHolder}
      {trigger
        ? cloneElement(trigger, {
            onClick: onOpen,
          })
        : null}
      <StepsForm
        stepsProps={{
          size: "small",
        }}
        stepsFormRender={(dom, submitter) => {
          return (
            <Modal
              width={640}
              styles={{
                body: {
                  padding: "32px 40px 48px",
                },
              }}
              destroyOnHidden
              title="Rule Configuration"
              open={open}
              footer={submitter}
              onCancel={onCancel}
            >
              {dom}
            </Modal>
          );
        }}
        onFinish={onFinish}
      >
        <StepsForm.StepForm initialValues={values} title="Basic Information">
          <ProFormText
            name="name"
            label="Rule Name"
            width="md"
            rules={[
              {
                required: true,
                message: "Please enter a rule name!",
              },
            ]}
          />
          <ProFormTextArea
            name="desc"
            width="md"
            label="Rule Description"
            placeholder="Please enter at least 5 characters"
            rules={[
              {
                required: true,
                message:
                  "Please enter a rule description of at least 5 characters!",
                min: 5,
              },
            ]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          initialValues={{
            target: "0",
            template: "0",
          }}
          title="Configure Rule Properties"
        >
          <ProFormSelect
            name="target"
            width="md"
            label="Monitoring Object"
            valueEnum={{
              0: "Table One",
              1: "Table Two",
            }}
          />
          <ProFormSelect
            name="template"
            width="md"
            label="Rule Template"
            valueEnum={{
              0: "Rule Template One",
              1: "Rule Template Two",
            }}
          />
          <ProFormRadio.Group
            name="type"
            label="Rule Type"
            options={[
              {
                value: "0",
                label: "Strong",
              },
              {
                value: "1",
                label: "Weak",
              },
            ]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          initialValues={{
            type: "1",
            frequency: "month",
          }}
          title="Set Scheduling Period"
        >
          <ProFormDateTimePicker
            name="time"
            width="md"
            label="Start Time"
            rules={[
              {
                required: true,
                message: "Please select a start time!",
              },
            ]}
          />
          <ProFormSelect
            name="frequency"
            label="Monitoring Object"
            width="md"
            valueEnum={{
              month: "Month",
              week: "Week",
            }}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </>
  );
};

export default UpdateForm;
