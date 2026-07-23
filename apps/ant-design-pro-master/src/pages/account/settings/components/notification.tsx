import { List, Switch } from 'antd';
import React from 'react';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const notificationAction = (key: string) => (
  <Switch
    key={key}
    checkedChildren="On"
    unCheckedChildren="Off"
    defaultChecked
  />
);

const notificationData = [
  {
    key: 'user-message',
    title: 'User Messages',
    description:
      'Messages from other users will be delivered as in-site notifications',
    actions: [notificationAction('user-message-switch')],
  },
  {
    key: 'system-message',
    title: 'System Messages',
    description: 'System messages will be delivered as in-site notifications',
    actions: [notificationAction('system-message-switch')],
  },
  {
    key: 'todo-task',
    title: 'To-Do Tasks',
    description: 'To-do tasks will be delivered as in-site notifications',
    actions: [notificationAction('todo-task-switch')],
  },
];

const NotificationView: React.FC = () => {
  const data = notificationData;
  return (
    <List<Unpacked<typeof data>>
      rowKey="key"
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item actions={item.actions}>
          <List.Item.Meta title={item.title} description={item.description} />
        </List.Item>
      )}
    />
  );
};

export default NotificationView;
