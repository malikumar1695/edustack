import {
  PageContainer,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  StepsForm,
} from '@ant-design/pro-components';
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Divider,
  Form,
  Result,
  Statistic,
} from 'antd';
import React, { useState } from 'react';
import type { StepDataType } from './data';
import useStyles from './style.style';

const StepDescriptions: React.FC<{
  stepData: StepDataType;
  bordered?: boolean;
}> = ({ stepData, bordered }) => {
  const { payAccount, receiverAccount, receiverName, amount } = stepData;
  const items = [
    { key: 'payAccount', label: 'Payment Account', children: payAccount },
    {
      key: 'receiverAccount',
      label: 'Receiving Account',
      children: receiverAccount,
    },
    { key: 'receiverName', label: 'Receiver Name', children: receiverName },
    {
      key: 'amount',
      label: 'Transfer Amount',
      children: (
        <Statistic
          value={amount}
          suffix={<span style={{ fontSize: 14 }}>CNY</span>}
          precision={2}
        />
      ),
    },
  ];
  return <Descriptions column={1} bordered={bordered} items={items} />;
};
const StepResult: React.FC<{
  onFinish: () => Promise<void>;
  children?: React.ReactNode;
}> = (props) => {
  const { styles } = useStyles();
  return (
    <Result
      status="success"
      title="Operation Successful"
      subTitle="Expected to arrive within two hours"
      extra={
        <>
          <Button type="primary" onClick={props.onFinish}>
            Make Another Transfer
          </Button>
          <Button>View Bill</Button>
        </>
      }
      className={styles.result}
    >
      {props.children}
    </Result>
  );
};
const StepForm: React.FC<Record<string, any>> = () => {
  const { styles } = useStyles();
  const [stepData, setStepData] = useState<StepDataType>({
    payAccount: 'ant-design@alipay.com',
    receiverAccount: 'test@example.com',
    receiverName: 'Alex',
    amount: '500',
    receiverMode: 'alipay',
  });
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm<StepDataType>();
  return (
    <PageContainer content="Split a lengthy or unfamiliar form task into multiple steps to guide the user through completion.">
      <Card variant="borderless">
        <StepsForm
          current={current}
          onCurrentChange={setCurrent}
          submitter={{
            render: (props, dom) => {
              if (props.step === 2) {
                return null;
              }
              return dom;
            },
          }}
        >
          <StepsForm.StepForm<StepDataType>
            formRef={{
              current: form,
            }}
            title="Enter Transfer Information"
            initialValues={stepData}
            onFinish={async (values) => {
              setStepData(values);
              return true;
            }}
          >
            <ProFormSelect
              label="Payment Account"
              width="md"
              name="payAccount"
              rules={[
                {
                  required: true,
                  message: 'Please select a payment account',
                },
              ]}
              valueEnum={{
                'ant-design@alipay.com': 'ant-design@alipay.com',
              }}
            />

            <ProForm.Group title="Receiving Account" size={8}>
              <ProFormSelect
                name="receiverMode"
                rules={[
                  {
                    required: true,
                    message: 'Please select a payment account',
                  },
                ]}
                valueEnum={{
                  alipay: 'Alipay',
                  bank: 'Bank Account',
                }}
              />
              <ProFormText
                name="receiverAccount"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the receiver account',
                  },
                  {
                    type: 'email',
                    message: 'Account name should be in email format',
                  },
                ]}
                placeholder="test@example.com"
              />
            </ProForm.Group>
            <ProFormText
              label="Receiver Name"
              width="md"
              name="receiverName"
              rules={[
                {
                  required: true,
                  message: 'Please enter the receiver name',
                },
              ]}
              placeholder="Please enter the receiver name"
            />
            <ProFormDigit
              label="Transfer Amount"
              name="amount"
              width="md"
              rules={[
                {
                  required: true,
                  message: 'Please enter a transfer amount',
                },
                {
                  pattern: /^(\d+)((?:\.\d+)?)$/,
                  message: 'Please enter a valid amount',
                },
              ]}
              placeholder="Please enter an amount"
              fieldProps={{
                prefix: '¥',
              }}
            />
          </StepsForm.StepForm>

          <StepsForm.StepForm title="Confirm Transfer Information">
            <div className={styles.result}>
              <Alert
                closable
                showIcon
                title="Once confirmed, funds will be transferred directly to the recipient's account and cannot be reversed."
                style={{
                  marginBottom: 24,
                }}
              />
              <StepDescriptions stepData={stepData} bordered />
              <Divider
                style={{
                  margin: '24px 0',
                }}
              />
              <ProFormText.Password
                label="Payment Password"
                width="md"
                name="password"
                required={false}
                rules={[
                  {
                    required: true,
                    message: 'A payment password is required to proceed',
                  },
                ]}
              />
            </div>
          </StepsForm.StepForm>
          <StepsForm.StepForm title="Done">
            <StepResult
              onFinish={async () => {
                setCurrent(0);
                form.resetFields();
              }}
            >
              <StepDescriptions stepData={stepData} />
            </StepResult>
          </StepsForm.StepForm>
        </StepsForm>
        <Divider
          style={{
            margin: '40px 0 24px',
          }}
        />
        <div>
          <h3>Notes</h3>
          <h4>Transfer to Alipay Account</h4>
          <p>
            If needed, this space can hold some frequently asked questions
            about the product. If needed, this space can hold some frequently
            asked questions about the product. If needed, this space can hold
            some frequently asked questions about the product.
          </p>
          <h4>Transfer to Bank Card</h4>
          <p>
            If needed, this space can hold some frequently asked questions
            about the product. If needed, this space can hold some frequently
            asked questions about the product. If needed, this space can hold
            some frequently asked questions about the product.
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};
export default StepForm;
