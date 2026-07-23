import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Result } from 'antd';
import type { FC } from 'react';
import type { BasicListItemDataType } from '../data';
import useStyles from '../style.style';

type OperationModalProps = {
  done: boolean;
  open: boolean;
  current: Partial<BasicListItemDataType> | undefined;
  onDone: () => void;
  onSubmit: (values: BasicListItemDataType) => void;
  children?: React.ReactElement;
};
const OperationModal: FC<OperationModalProps> = (props) => {
  const { styles } = useStyles();
  const { done, open, current, onDone, onSubmit, children } = props;

  return (
    <ModalForm<BasicListItemDataType>
      open={open}
      title={done ? null : `${current ? 'Edit' : 'Add'} Task`}
      className={styles.standardListForm}
      width={640}
      onFinish={async (values) => {
        onSubmit(values);
      }}
      initialValues={current}
      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
      trigger={children}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnHidden: true,
        styles: {
          body: done
            ? {
                padding: '72px',
              }
            : undefined,
        },
      }}
    >
      {!done ? (
        <>
          <ProFormText
            name="title"
            label="Task Name"
            rules={[
              {
                required: true,
                message: 'Please enter a task name',
              },
            ]}
            placeholder="Please enter"
          />
          <ProFormDateTimePicker
            name="createdAt"
            label="Start Time"
            rules={[
              {
                required: true,
                message: 'Please select a start time',
              },
            ]}
            fieldProps={{
              style: {
                width: '100%',
              },
            }}
            placeholder="Please select"
          />
          <ProFormSelect
            name="owner"
            label="Task Owner"
            rules={[
              {
                required: true,
                message: 'Please select a task owner',
              },
            ]}
            options={[
              {
                label: 'Xiao Fu',
                value: 'xiao',
              },
              {
                label: 'Mao Zhou',
                value: 'mao',
              },
            ]}
            placeholder="Please select an admin"
          />
          <ProFormTextArea
            name="subDescription"
            label="Product Description"
            rules={[
              {
                message:
                  'Please enter a product description of at least 5 characters!',
                min: 5,
              },
            ]}
            placeholder="Please enter at least 5 characters"
          />
        </>
      ) : (
        <Result
          status="success"
          title="Operation Successful"
          subTitle="A series of information description, which can be short with punctuation as well."
          extra={
            <Button type="primary" onClick={onDone}>
              Got it
            </Button>
          }
          className={styles.formResult}
        />
      )}
    </ModalForm>
  );
};
export default OperationModal;
