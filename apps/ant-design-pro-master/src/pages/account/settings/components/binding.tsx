import {
  AlipayOutlined,
  DingdingOutlined,
  TaobaoOutlined,
} from '@ant-design/icons';
import { Button, List } from 'antd';
import React from 'react';

const bindingData = [
  {
    title: 'Bind Taobao',
    description: 'Taobao account is not currently bound',
    actions: [
      <Button key="Bind" type="link">
        Bind
      </Button>,
    ],
    avatar: <TaobaoOutlined className="taobao" />,
  },
  {
    title: 'Bind Alipay',
    description: 'Alipay account is not currently bound',
    actions: [
      <Button key="Bind" type="link">
        Bind
      </Button>,
    ],
    avatar: <AlipayOutlined className="alipay" />,
  },
  {
    title: 'Bind DingTalk',
    description: 'DingTalk account is not currently bound',
    actions: [
      <Button key="Bind" type="link">
        Bind
      </Button>,
    ],
    avatar: <DingdingOutlined className="dingding" />,
  },
];

const BindingView: React.FC = () => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={bindingData}
      renderItem={(item) => (
        <List.Item actions={item.actions}>
          <List.Item.Meta
            avatar={item.avatar}
            title={item.title}
            description={item.description}
          />
        </List.Item>
      )}
    />
  );
};

export default BindingView;
