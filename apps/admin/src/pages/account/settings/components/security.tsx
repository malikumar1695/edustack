import { Button, List } from "antd";

// The original demo colored these via `:global` selectors in
// account/settings/style.style.ts (createStyles) targeting plain
// `.strong`/`.medium`/`.weak` classNames — converted to inline styles here,
// using the same token colors (success/warning/error).
const passwordStrength = {
  strong: <span style={{ color: "#52c41a" }}>Strong</span>,
  medium: <span style={{ color: "#faad14" }}>Medium</span>,
  weak: <span style={{ color: "#ff4d4f" }}>Weak</span>,
};

const securityData = [
  {
    title: "Account Password",
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
    title: "Security Phone",
    description: "Bound phone: 138****8293",
    actions: [
      <Button key="Modify" type="link">
        Change
      </Button>,
    ],
  },
  {
    title: "Security Question",
    description:
      "No security question set. A security question can help protect your account",
    actions: [
      <Button key="Set" type="link">
        Set
      </Button>,
    ],
  },
  {
    title: "Backup Email",
    description: "Bound email: ant***sign.com",
    actions: [
      <Button key="Modify" type="link">
        Change
      </Button>,
    ],
  },
  {
    title: "MFA Device",
    description:
      "No MFA device bound. Once bound, you can use two-factor confirmation",
    actions: [
      <Button key="bind" type="link">
        Bind
      </Button>,
    ],
  },
];

export default function SecurityView() {
  return (
    <List
      itemLayout="horizontal"
      dataSource={securityData}
      renderItem={(item) => (
        <List.Item actions={item.actions}>
          <List.Item.Meta title={item.title} description={item.description} />
        </List.Item>
      )}
    />
  );
}
