import { Button, List } from 'antd';
import React from 'react';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const passwordStrength = {
  strong: <span className="strong">Strong</span>,
  medium: <span className="medium">Medium</span>,
  weak: <span className="weak">Weak</span>,
};

const securityData = [
  {
    title: 'Account Password',
    description: (
      <>
        Current password strength:
        {passwordStrength.strong}
      </>
    ),
    actions: [
      <Button key="Modify" type="link">
        Change
      </Button>,
    ],
  },
  {
    title: 'Security Phone',
    description: `Bound phone: 138****8293`,
    actions: [
      <Button key="Modify" type="link">
        Change
      </Button>,
    ],
  },
  {
    title: 'Security Question',
    description:
      'No security question set. A security question can help protect your account',
    actions: [
      <Button key="Set" type="link">
        Set
      </Button>,
    ],
  },
  {
    title: 'Backup Email',
    description: `Bound email: ant***sign.com`,
    actions: [
      <Button key="Modify" type="link">
        Change
      </Button>,
    ],
  },
  {
    title: 'MFA Device',
    description:
      'No MFA device bound. Once bound, you can use two-factor confirmation',
    actions: [
      <Button key="bind" type="link">
        Bind
      </Button>,
    ],
  },
];

const SecurityView: React.FC = () => {
  const data = securityData;
  return (
    <List<Unpacked<typeof data>>
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

export default SecurityView;
