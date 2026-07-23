import {
  PageContainer,
  ProForm,
  ProFormDateRangePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, message } from 'antd';
import type { FC } from 'react';
import { fakeSubmitForm } from './service';
import useStyles from './style.style';

const BasicForm: FC<Record<string, any>> = () => {
  const { styles } = useStyles();
  const queryClient = useQueryClient();
  const { mutate: run } = useMutation({
    mutationFn: fakeSubmitForm,
    onSuccess: () => {
      message.success('Submitted successfully');
      queryClient.invalidateQueries({ queryKey: ['basic-form'] });
    },
  });
  const onFinish = async (values: Record<string, any>) => {
    run(values);
  };
  return (
    <PageContainer content="Form pages are used to collect or verify information from users. Basic forms are commonly used in scenarios with fewer data fields.">
      <Card variant="borderless">
        <ProForm
          requiredMark={false}
          style={{
            margin: 'auto',
            marginTop: 8,
            maxWidth: 600,
          }}
          name="basic"
          layout="vertical"
          initialValues={{
            public: '1',
          }}
          onFinish={onFinish}
        >
          <ProFormText
            width="md"
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: 'Please enter a title',
              },
            ]}
            placeholder="Give your goal a name"
          />
          <ProFormDateRangePicker
            label="Start and End Date"
            width="md"
            name="date"
            rules={[
              {
                required: true,
                message: 'Please select a start and end date',
              },
            ]}
            placeholder={['Start Date', 'End Date']}
          />
          <ProFormTextArea
            label="Goal Description"
            width="xl"
            name="goal"
            rules={[
              {
                required: true,
                message: 'Please enter a goal description',
              },
            ]}
            placeholder="Please enter your phased work goal"
          />

          <ProFormTextArea
            label="Success Metrics"
            name="standard"
            width="xl"
            rules={[
              {
                required: true,
                message: 'Please enter the success metrics',
              },
            ]}
            placeholder="Please enter the success metrics"
          />

          <ProFormText
            width="md"
            label={
              <span>
                Client
                <em className={styles.optional}>(Optional)</em>
              </span>
            }
            tooltip="The target audience of the goal"
            name="client"
            placeholder="Describe the client you serve; for internal clients, use @name/employee ID directly"
          />

          <ProFormText
            width="md"
            label={
              <span>
                Reviewer
                <em className={styles.optional}>(Optional)</em>
              </span>
            }
            name="invites"
            placeholder="Use @name/employee ID directly; up to 5 people may be invited"
          />

          <ProFormDigit
            label={
              <span>
                Weight
                <em className={styles.optional}>(Optional)</em>
              </span>
            }
            name="weight"
            placeholder="Please enter"
            min={0}
            max={100}
            width="xs"
            fieldProps={{
              formatter: (value) => `${value || 0}%`,
              parser: (value) => Number(value ? value.replace('%', '') : '0'),
            }}
          />

          <ProFormRadio.Group
            options={[
              {
                value: '1',
                label: 'Public',
              },
              {
                value: '2',
                label: 'Partially Public',
              },
              {
                value: '3',
                label: 'Private',
              },
            ]}
            label="Goal Visibility"
            help="Clients and reviewers are shared by default"
            name="publicType"
          />
          <ProFormDependency name={['publicType']}>
            {({ publicType }) => {
              return (
                <ProFormSelect
                  width="md"
                  name="publicUsers"
                  fieldProps={{
                    style: {
                      margin: '8px 0',
                      display:
                        publicType && publicType === '2' ? 'block' : 'none',
                    },
                  }}
                  options={[
                    {
                      value: '1',
                      label: 'Colleague A',
                    },
                    {
                      value: '2',
                      label: 'Colleague B',
                    },
                    {
                      value: '3',
                      label: 'Colleague C',
                    },
                  ]}
                />
              );
            }}
          </ProFormDependency>
        </ProForm>
      </Card>
    </PageContainer>
  );
};
export default BasicForm;
