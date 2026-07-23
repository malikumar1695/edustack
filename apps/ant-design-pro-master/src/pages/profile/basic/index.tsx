import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useQuery } from '@tanstack/react-query';
import type { DescriptionsProps } from 'antd';
import { Badge, Card, Descriptions, Divider, Table } from 'antd';
import type { FC } from 'react';
import React from 'react';
import type { BasicGood, BasicProgress } from './data';
import { queryBasicProfile } from './service';

const progressColumns: ProColumns<BasicProgress>[] = [
  {
    title: 'Time',
    dataIndex: 'time',
  },
  {
    title: 'Current Progress',
    dataIndex: 'rate',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (text: React.ReactNode) => {
      if (text === 'success') {
        return <Badge status="success" text="Success" />;
      }
      return <Badge status="processing" text="In Progress" />;
    },
  },
  {
    title: 'Operator ID',
    dataIndex: 'operator',
  },
  {
    title: 'Duration',
    dataIndex: 'cost',
  },
];
const goodsColumns: ProColumns<BasicGood>[] = [
  {
    title: 'Product ID',
    dataIndex: 'id',
  },
  {
    title: 'Product Name',
    dataIndex: 'name',
  },
  {
    title: 'Product Barcode',
    dataIndex: 'barcode',
  },
  {
    title: 'Unit Price',
    dataIndex: 'price',
  },
  {
    title: 'Quantity (pcs)',
    dataIndex: 'num',
    align: 'right',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    align: 'right',
  },
];

const Descriptions1: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'Pickup Order No.',
    children: '1000000000',
  },
  {
    key: '2',
    label: 'Status',
    children: 'Picked Up',
  },
  {
    key: '3',
    label: 'Sales Order No.',
    children: '1234123421',
  },
  {
    key: '4',
    label: 'Sub-order',
    children: '3214321432',
  },
];
const Descriptions2: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'User Name',
    children: 'Xiaoxiao Fu',
  },
  {
    key: '2',
    label: 'Contact Number',
    children: '18100000000',
  },
  {
    key: '3',
    label: 'Preferred Courier',
    children: 'Cainiao Logistics',
  },
  {
    key: '4',
    label: 'Pickup Address',
    children: '18 Wantang Road, Xihu District, Hangzhou, Zhejiang',
  },
  {
    key: '5',
    label: 'Remarks',
    children: 'None',
  },
];

const Basic: FC = () => {
  const { data, isLoading: loading } = useQuery({
    queryKey: ['profile-basic'],
    queryFn: () => queryBasicProfile().then((res) => res.data),
  });
  const { basicGoods, basicProgress } = data || {
    basicGoods: [],
    basicProgress: [],
  };
  return (
    <PageContainer>
      <Card variant="borderless">
        <Descriptions title="Refund Request" items={Descriptions1} />
        <Divider size="large" />
        <Descriptions title="User Information" items={Descriptions2} />
        <Divider size="large" />
        <ProTable
          headerTitle="Returned Items"
          style={{
            marginBottom: 24,
          }}
          pagination={false}
          search={false}
          loading={loading}
          options={false}
          dataSource={basicGoods}
          ghost
          columns={goodsColumns}
          rowKey="id"
          summary={(pageData) => {
            let totalNum = 0;
            let totalAmount = 0;
            pageData.forEach(({ num, amount }) => {
              totalNum += Number(num);
              totalAmount += Number(amount);
            });
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4}>
                  <span style={{ fontWeight: 600 }}>Total</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} align="right">
                  <span style={{ fontWeight: 600 }}>{totalNum}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} align="right">
                  <span style={{ fontWeight: 600 }}>{totalAmount}</span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
        <ProTable
          headerTitle="Return Progress"
          pagination={false}
          loading={loading}
          search={false}
          options={false}
          ghost
          dataSource={basicProgress}
          columns={progressColumns}
        />
      </Card>
    </PageContainer>
  );
};
export default Basic;
