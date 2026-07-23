import {
  DingdingOutlined,
  DownOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  GridContent,
  PageContainer,
  RouteContext,
} from '@ant-design/pro-components';
import { useQuery } from '@tanstack/react-query';
import type { DescriptionsProps } from 'antd';
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Divider,
  Dropdown,
  Empty,
  Popover,
  Space,
  Statistic,
  Steps,
  Table,
  Tooltip,
} from 'antd';
import type { IconRenderType, StepsProps } from 'antd/es/steps';
import type { FC } from 'react';
import React, { useState } from 'react';
import type { AdvancedProfileData } from './data';
import { queryAdvancedProfile } from './service';
import useStyles from './style.style';

const action = (
  <RouteContext.Consumer>
    {({ isMobile }) => {
      if (isMobile) {
        return (
          <Dropdown.Button
            type="primary"
            icon={<DownOutlined />}
            menu={{
              items: [
                {
                  key: '1',
                  label: 'Action One',
                },
                {
                  key: '2',
                  label: 'Action Two',
                },
                {
                  key: '3',
                  label: 'Action Three',
                },
              ],
            }}
            placement="bottomRight"
          >
            Main Action
          </Dropdown.Button>
        );
      }
      return (
        <Space>
          <Space.Compact>
            <Button>Action One</Button>
            <Button>Action Two</Button>
            <Dropdown
              menu={{
                items: [
                  {
                    key: '1',
                    label: 'Option One',
                  },
                  {
                    key: '2',
                    label: 'Option Two',
                  },
                  {
                    key: '3',
                    label: 'Option Three',
                  },
                ],
              }}
              placement="bottomRight"
            >
              <Button>
                <EllipsisOutlined />
              </Button>
            </Dropdown>
          </Space.Compact>
          <Button type="primary">Main Action</Button>
        </Space>
      );
    }}
  </RouteContext.Consumer>
);

const operationTabList = [
  {
    key: 'tab1',
    tab: 'Operation Log One',
  },
  {
    key: 'tab2',
    tab: 'Operation Log Two',
  },
  {
    key: 'tab3',
    tab: 'Operation Log Three',
  },
];
const columns = [
  {
    title: 'Action Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Operator',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Result',
    dataIndex: 'status',
    key: 'status',
    render: (text: string) => {
      if (text === 'agree') {
        return <Badge status="success" text="Success" />;
      }
      return <Badge status="error" text="Rejected" />;
    },
  },
  {
    title: 'Action Time',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: 'Remarks',
    dataIndex: 'memo',
    key: 'memo',
  },
];
const descriptionItems: DescriptionsProps['items'] = [
  { key: '1', label: 'Created By', children: 'Lily Qu' },
  { key: '2', label: 'Product Ordered', children: 'XX Service' },
  { key: '3', label: 'Created At', children: '2017-07-07' },
  { key: '4', label: 'Related Document', children: <a href="/">12421</a> },
  { key: '5', label: 'Effective Date', children: '2017-07-07 ~ 2017-08-08' },
  {
    key: '6',
    label: 'Remarks',
    children: 'Please confirm within two business days',
  },
];
const userInfoItems: DescriptionsProps['items'] = [
  { key: '1', label: 'User Name', children: 'Xiaoxiao Fu' },
  { key: '2', label: 'Membership Number', children: '32943898021309809423' },
  { key: '3', label: 'ID Number', children: '3321944288191034921' },
  { key: '4', label: 'Contact', children: '18112345678' },
  {
    key: '5',
    label: 'Address',
    children:
      'Lily Qu, 18100000000, Intersection of Huanggu Mountain Road and Main Street, Xihu District, Hangzhou, Zhejiang',
  },
];
const infoGroupItems: DescriptionsProps['items'] = [
  { key: '1', label: 'Some Data', children: '725' },
  { key: '2', label: 'Data Updated At', children: '2017-08-08' },
  {
    key: '3',
    label: (
      <span>
        Some Data
        <Tooltip title="Data description">
          <InfoCircleOutlined
            style={{ color: 'rgba(0, 0, 0, 0.43)', marginLeft: 4 }}
          />
        </Tooltip>
      </span>
    ),
    children: '725',
  },
  { key: '4', label: 'Data Updated At', children: '2017-08-08' },
];
const groupItems1: DescriptionsProps['items'] = [
  { key: '1', label: 'Owner', children: 'Dongdong Lin' },
  { key: '2', label: 'Role Code', children: '1234567' },
  { key: '3', label: 'Department', children: 'XX Company - YY Dept' },
  { key: '4', label: 'Expiry Date', children: '2017-08-08' },
  {
    key: '5',
    label: 'Description',
    children:
      'This description is very long, very long, very long, very long, very long, very long...',
  },
];
const groupItems2: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'Scientific Name',
    children:
      'Citrullus lanatus (Thunb.) Matsum. et Nakai. An annual trailing vine; stems and branches stout, with obvious ridges. Tendrils relatively thick..',
  },
];
const groupItems3: DescriptionsProps['items'] = [
  { key: '1', label: 'Owner', children: 'Xiaoxiao Fu' },
  { key: '2', label: 'Role Code', children: '1234568' },
];
const customDot: IconRenderType = (dot: React.ReactNode, { active }) => {
  if (active) {
    const popoverContent = (
      <div
        style={{
          width: 160,
        }}
      >
        Jiahao Wu
        <span
          style={{
            float: 'right',
          }}
        >
          <Badge
            status="default"
            text={
              <span
                style={{
                  color: 'rgba(0, 0, 0, 0.45)',
                }}
              >
                No response
              </span>
            }
          />
        </span>
        <div
          style={{
            marginTop: 4,
          }}
        >
          Duration: 2 hours 25 minutes
        </div>
      </div>
    );
    return (
      <Popover
        placement="topLeft"
        arrow={{
          pointAtCenter: true,
        }}
        content={popoverContent}
      >
        <span>{dot}</span>
      </Popover>
    );
  }
  return dot;
};

type AdvancedState = {
  operationKey: 'tab1' | 'tab2' | 'tab3';
  tabActiveKey: string;
};
const Advanced: FC = () => {
  const { styles } = useStyles();

  const extra = (
    <div className={styles.moreInfo}>
      <Statistic title="Status" value="Pending Approval" />
      <Statistic title="Order Amount" value={568.08} prefix="¥" />
    </div>
  );
  const description = (
    <RouteContext.Consumer>
      {({ isMobile }) => (
        <Descriptions
          className={styles.headerList}
          size="small"
          column={isMobile ? 1 : 2}
          items={descriptionItems}
        />
      )}
    </RouteContext.Consumer>
  );
  const desc1 = (
    <div className={styles.stepDescription}>
      Lily Qu
      <DingdingOutlined
        style={{
          marginLeft: 8,
        }}
      />
      <div>2016-12-12 12:32</div>
    </div>
  );
  const desc2 = (
    <div className={styles.stepDescription}>
      Mao Zhou
      <DingdingOutlined
        style={{
          color: '#00A0E9',
          marginLeft: 8,
        }}
      />
      <div>
        <Button type="link" style={{ padding: 0 }}>
          Send a reminder
        </Button>
      </div>
    </div>
  );
  const stepsItems: StepsProps['items'] = [
    { title: 'Create Project', content: desc1 },
    { title: 'Department Initial Review', content: desc2 },
    { title: 'Finance Review' },
    { title: 'Done' },
  ];

  const [tabStatus, seTabStatus] = useState<AdvancedState>({
    operationKey: 'tab1',
    tabActiveKey: 'detail',
  });

  const { data = {}, isLoading: loading } = useQuery<AdvancedProfileData>({
    queryKey: ['profile-advanced'],
    queryFn: () => queryAdvancedProfile().then((res) => res.data),
  });
  const { advancedOperation1, advancedOperation2, advancedOperation3 } = data;
  const contentList = {
    tab1: (
      <Table
        pagination={false}
        loading={loading}
        dataSource={advancedOperation1}
        columns={columns}
      />
    ),
    tab2: (
      <Table
        pagination={false}
        loading={loading}
        dataSource={advancedOperation2}
        columns={columns}
      />
    ),
    tab3: (
      <Table
        pagination={false}
        loading={loading}
        dataSource={advancedOperation3}
        columns={columns}
      />
    ),
  };
  const onTabChange = (tabActiveKey: string) => {
    seTabStatus({
      ...tabStatus,
      tabActiveKey,
    });
  };
  const onOperationTabChange = (key: string) => {
    seTabStatus({
      ...tabStatus,
      operationKey: key as 'tab1',
    });
  };
  return (
    <PageContainer
      title="Order No.: 234231029431"
      extra={action}
      className={styles.pageHeader}
      content={description}
      extraContent={extra}
      tabActiveKey={tabStatus.tabActiveKey}
      onTabChange={onTabChange}
      tabList={[
        {
          key: 'detail',
          tab: 'Details',
        },
        {
          key: 'rule',
          tab: 'Rules',
        },
      ]}
    >
      <div className={styles.main}>
        <GridContent>
          <Card
            title="Process Progress"
            style={{
              marginBottom: 24,
            }}
          >
            <RouteContext.Consumer>
              {({ isMobile }) => (
                <Steps
                  orientation={isMobile ? 'vertical' : 'horizontal'}
                  iconRender={customDot}
                  current={1}
                  items={stepsItems}
                />
              )}
            </RouteContext.Consumer>
          </Card>
          <Card
            title="User Information"
            style={{
              marginBottom: 24,
            }}
            variant="borderless"
          >
            <Descriptions
              style={{
                marginBottom: 24,
              }}
              items={userInfoItems}
            />
            <Descriptions
              style={{
                marginBottom: 24,
              }}
              title="Info Group"
              items={infoGroupItems}
            />
            <h4
              style={{
                marginBottom: 16,
              }}
            >
              Info Group
            </h4>
            <Card type="inner" title="Multi-level Info Group">
              <Descriptions title="Group Name" items={groupItems1} />
              <Divider size="large" />
              <Descriptions title="Group Name" column={1} items={groupItems2} />
              <Divider size="large" />
              <Descriptions title="Group Name" items={groupItems3} />
            </Card>
          </Card>
          <Card
            title="User's Call Records for the Past Six Months"
            style={{
              marginBottom: 24,
            }}
            variant="borderless"
          >
            <Empty />
          </Card>
          <Card
            variant="borderless"
            tabList={operationTabList}
            onTabChange={onOperationTabChange}
          >
            {contentList[tabStatus.operationKey] as React.ReactNode}
          </Card>
        </GridContent>
      </div>
    </PageContainer>
  );
};
export default Advanced;
