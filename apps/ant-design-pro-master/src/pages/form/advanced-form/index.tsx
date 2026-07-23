import { CloseCircleOutlined } from '@ant-design/icons';
import type { ProColumnType } from '@ant-design/pro-components';
import {
  EditableProTable,
  FooterToolbar,
  PageContainer,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormTimePicker,
} from '@ant-design/pro-components';
import { Button, Card, Col, message, Popover, Row } from 'antd';
import type { FC } from 'react';
import { useRef, useState } from 'react';
import { fakeSubmitForm } from './service';
import useStyles from './style.style';

interface TableFormDateType {
  key: string;
  workId?: string;
  name?: string;
  department?: string;
  isNew?: boolean;
  editable?: boolean;
}
type InternalNamePath = (string | number)[];
const fieldLabels = {
  name: 'Repository Name',
  url: 'Repository URL',
  owner: 'Repository Admin',
  approver: 'Approver',
  dateRange: 'Effective Date',
  type: 'Repository Type',
  name2: 'Task Name',
  url2: 'Task Description',
  owner2: 'Assignee',
  approver2: 'Responsible Person',
  dateRange2: 'Effective Date',
  type2: 'Task Type',
};
const tableData = [
  {
    key: '1',
    workId: '00001',
    name: 'John Brown',
    department: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    workId: '00002',
    name: 'Jim Green',
    department: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    workId: '00003',
    name: 'Joe Black',
    department: 'Sidney No. 1 Lake Park',
  },
];
interface ErrorField {
  name: InternalNamePath;
  errors: string[];
}
const AdvancedForm: FC<Record<string, any>> = () => {
  const { styles } = useStyles();
  const [error, setError] = useState<ErrorField[]>([]);
  const keyCounter = useRef(0);
  const getErrorInfo = (errors: ErrorField[]) => {
    const errorCount = errors.filter((item) => item.errors.length > 0).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }
      const key = err.name[0] as
        | 'name'
        | 'url'
        | 'owner'
        | 'approver'
        | 'dateRange'
        | 'type';
      return (
        <button
          key={key}
          type="button"
          className={styles.errorListItem}
          onClick={() => scrollToField(key)}
        >
          <CloseCircleOutlined className={styles.errorIcon} />
          <div>{err.errors[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </button>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="Form Validation Information"
          content={errorList}
          classNames={{
            root: styles.errorPopover,
          }}
          trigger="click"
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger?.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };
  const onFinish = async (values: Record<string, any>) => {
    setError([]);
    try {
      await fakeSubmitForm(values);
      message.success('Submitted successfully');
    } catch {
      message.error('Submission failed, please try again!');
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    setError(errorInfo.errorFields);
  };
  const columns: ProColumnType<TableFormDateType>[] = [
    {
      title: 'Member Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: 'Employee ID',
      dataIndex: 'workId',
      key: 'workId',
      width: '20%',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: '40%',
    },
    {
      title: 'Action',
      key: 'action',
      valueType: 'option',
      render: (_, record: TableFormDateType, _index, action) => {
        return [
          <Button
            key="eidit"
            type="link"
            onClick={() => action?.startEditable(record.key)}
          >
            Edit
          </Button>,
        ];
      },
    },
  ];
  return (
    <ProForm
      layout="vertical"
      requiredMark={false}
      submitter={{
        render: (_props, dom) => {
          return (
            <FooterToolbar>
              {getErrorInfo(error)}
              {dom}
            </FooterToolbar>
          );
        },
      }}
      initialValues={{
        members: tableData,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <PageContainer content="Advanced forms are commonly used for entering and submitting large batches of data at once.">
        <Card
          title="Repository Management"
          className={styles.card}
          variant="borderless"
        >
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <ProFormText
                label={fieldLabels.name}
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter a repository name',
                  },
                ]}
                placeholder="Please enter a repository name"
              />
            </Col>
            <Col
              xl={{
                span: 6,
                offset: 2,
              }}
              lg={{
                span: 8,
              }}
              md={{
                span: 12,
              }}
              sm={24}
            >
              <ProFormText
                label={fieldLabels.url}
                name="url"
                rules={[
                  {
                    required: true,
                    message: 'Please select',
                  },
                ]}
                fieldProps={{
                  style: {
                    width: '100%',
                  },
                  addonBefore: 'http://',
                  addonAfter: '.com',
                }}
                placeholder="Please enter"
              />
            </Col>
            <Col
              xl={{
                span: 8,
                offset: 2,
              }}
              lg={{
                span: 10,
              }}
              md={{
                span: 24,
              }}
              sm={24}
            >
              <ProFormSelect
                label={fieldLabels.owner}
                name="owner"
                rules={[
                  {
                    required: true,
                    message: 'Please select an admin',
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
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <ProFormSelect
                label={fieldLabels.approver}
                name="approver"
                rules={[
                  {
                    required: true,
                    message: 'Please select an approver',
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
                placeholder="Please select an approver"
              />
            </Col>
            <Col
              xl={{
                span: 6,
                offset: 2,
              }}
              lg={{
                span: 8,
              }}
              md={{
                span: 12,
              }}
              sm={24}
            >
              <ProFormDateRangePicker
                label={fieldLabels.dateRange}
                name="dateRange"
                fieldProps={{
                  style: {
                    width: '100%',
                  },
                }}
                rules={[
                  {
                    required: true,
                    message: 'Please select an effective date',
                  },
                ]}
              />
            </Col>
            <Col
              xl={{
                span: 8,
                offset: 2,
              }}
              lg={{
                span: 10,
              }}
              md={{
                span: 24,
              }}
              sm={24}
            >
              <ProFormSelect
                label={fieldLabels.type}
                name="type"
                rules={[
                  {
                    required: true,
                    message: 'Please select a repository type',
                  },
                ]}
                options={[
                  {
                    label: 'Private',
                    value: 'private',
                  },
                  {
                    label: 'Public',
                    value: 'public',
                  },
                ]}
                placeholder="Please select a repository type"
              />
            </Col>
          </Row>
        </Card>
        <Card title="Task Management" className={styles.card} variant="borderless">
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <ProFormText
                label={fieldLabels.name2}
                name="name2"
                rules={[
                  {
                    required: true,
                    message: 'Please enter',
                  },
                ]}
              />
            </Col>
            <Col
              xl={{
                span: 6,
                offset: 2,
              }}
              lg={{
                span: 8,
              }}
              md={{
                span: 12,
              }}
              sm={24}
            >
              <ProFormText
                label={fieldLabels.url2}
                name="url2"
                rules={[
                  {
                    required: true,
                    message: 'Please select',
                  },
                ]}
              />
            </Col>
            <Col
              xl={{
                span: 8,
                offset: 2,
              }}
              lg={{
                span: 10,
              }}
              md={{
                span: 24,
              }}
              sm={24}
            >
              <ProFormSelect
                label={fieldLabels.owner2}
                name="owner2"
                rules={[
                  {
                    required: true,
                    message: 'Please select an admin',
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
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <ProFormSelect
                label={fieldLabels.approver2}
                name="approver2"
                rules={[
                  {
                    required: true,
                    message: 'Please select an approver',
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
                placeholder="Please select an approver"
              />
            </Col>
            <Col
              xl={{
                span: 6,
                offset: 2,
              }}
              lg={{
                span: 8,
              }}
              md={{
                span: 12,
              }}
              sm={24}
            >
              <ProFormTimePicker
                label={fieldLabels.dateRange2}
                name="dateRange2"
                rules={[
                  {
                    required: true,
                    message: 'Please enter',
                  },
                ]}
                placeholder="Reminder time"
                fieldProps={{
                  style: {
                    width: '100%',
                  },
                }}
              />
            </Col>
            <Col
              xl={{
                span: 8,
                offset: 2,
              }}
              lg={{
                span: 10,
              }}
              md={{
                span: 24,
              }}
              sm={24}
            >
              <ProFormSelect
                label={fieldLabels.type2}
                name="type2"
                rules={[
                  {
                    required: true,
                    message: 'Please select a repository type',
                  },
                ]}
                options={[
                  {
                    label: 'Private',
                    value: 'private',
                  },
                  {
                    label: 'Public',
                    value: 'public',
                  },
                ]}
                placeholder="Please select a repository type"
              />
            </Col>
          </Row>
        </Card>
        <Card title="Member Management" variant="borderless">
          <ProForm.Item name="members">
            <EditableProTable<TableFormDateType>
              recordCreatorProps={{
                record: () => {
                  keyCounter.current += 1;
                  return {
                    key: `new-${keyCounter.current}`,
                  };
                },
              }}
              columns={columns}
              rowKey="key"
            />
          </ProForm.Item>
        </Card>
      </PageContainer>
    </ProForm>
  );
};
export default AdvancedForm;
