import {
  AlipayOutlined,
  DingdingOutlined,
  TaobaoOutlined,
} from "@ant-design/icons";
import { Button, List } from "antd";
import React from "react";

// The original demo's binding.tsx set className="taobao"/"alipay"/"dingding"
// on these icons, but no matching CSS class was ever defined anywhere in
// the project (a pre-existing loose end in the upstream template — those
// classNames rendered unstyled). The color/size intent for exactly these
// three icons *was* defined, just orphaned, in account/settings/style.style.ts
// (createStyles). Reconnected here as inline styles since we're already
// converting that file away from antd-style.
const taobaoStyle: React.CSSProperties = {
  display: "block",
  color: "#ff4000",
  fontSize: 48,
  lineHeight: "48px",
};
const dingdingStyle: React.CSSProperties = {
  margin: 2,
  padding: 6,
  color: "#fff",
  fontSize: 32,
  lineHeight: "32px",
  backgroundColor: "#2eabff",
  borderRadius: 4,
};
const alipayStyle: React.CSSProperties = {
  color: "#2eabff",
  fontSize: 48,
  lineHeight: "48px",
};

const bindingData = [
  {
    title: "Bind Taobao",
    description: "Taobao account is not currently bound",
    actions: [
      <Button key="Bind" type="link">
        Bind
      </Button>,
    ],
    avatar: <TaobaoOutlined style={taobaoStyle} />,
  },
  {
    title: "Bind Alipay",
    description: "Alipay account is not currently bound",
    actions: [
      <Button key="Bind" type="link">
        Bind
      </Button>,
    ],
    avatar: <AlipayOutlined style={alipayStyle} />,
  },
  {
    title: "Bind DingTalk",
    description: "DingTalk account is not currently bound",
    actions: [
      <Button key="Bind" type="link">
        Bind
      </Button>,
    ],
    avatar: <DingdingOutlined style={dingdingStyle} />,
  },
];

export default function BindingView() {
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
}
