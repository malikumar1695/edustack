import {
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Dropdown, List, Tooltip } from "antd";
import React, { useState } from "react";
import type { ListItemDataType } from "../../_mock";
import { fakeList } from "../../_mock";

// Ported from ant-design-pro-master's src/utils/format.ts (formatNumber) —
// colocated here since this is the only component in this batch that needs
// it, rather than adding a shared src/utils/format.ts outside this page tree.
const numberFormatter = new Intl.NumberFormat("en-US");
function formatNumber(val: number | string): string {
  const parsed = Number(val);
  return Number.isFinite(parsed) ? numberFormatter.format(parsed) : "";
}

function formatWan(val: number) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return "";
  let result: React.ReactNode = val;
  if (val > 10000) {
    result = (
      <span>
        {Math.floor(val / 10000)}
        <span
          style={{
            position: "relative",
            top: -2,
            fontSize: 14,
            fontStyle: "normal",
            marginLeft: 2,
          }}
        >
          0K
        </span>
      </span>
    );
  }
  return result;
}

const CardInfo: React.FC<{
  activeUser: React.ReactNode;
  newUser: React.ReactNode;
}> = ({ activeUser, newUser }) => {
  return (
    <div style={{ marginTop: 16, marginLeft: 40, display: "flex" }}>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, marginBottom: 4, color: "rgba(0, 0, 0, 0.45)", fontSize: 12, lineHeight: "20px" }}>
          Active Users
        </p>
        <p style={{ margin: 0, fontSize: 24, lineHeight: "32px" }}>{activeUser}</p>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, marginBottom: 4, color: "rgba(0, 0, 0, 0.45)", fontSize: 12, lineHeight: "20px" }}>
          New Users
        </p>
        <p style={{ margin: 0, fontSize: 24, lineHeight: "32px" }}>{newUser}</p>
      </div>
    </div>
  );
};

export default function Applications() {
  const [listData] = useState(() => fakeList(30));

  return (
    <List<ListItemDataType>
      rowKey="id"
      style={{ marginBottom: -24 }}
      grid={{
        gutter: 24,
        xxl: 3,
        xl: 2,
        lg: 2,
        md: 2,
        sm: 2,
        xs: 1,
      }}
      dataSource={listData}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <Card
            hoverable
            styles={{
              body: {
                paddingBottom: 20,
              },
            }}
            actions={[
              <Tooltip key="download" title="Download">
                <DownloadOutlined />
              </Tooltip>,
              <Tooltip title="Edit" key="edit">
                <EditOutlined />
              </Tooltip>,
              <Tooltip title="Share" key="share">
                <ShareAltOutlined />
              </Tooltip>,
              <Dropdown
                menu={{
                  items: [
                    { key: "1", title: "1st menu item" },
                    { key: "2", title: "2nd menu item" },
                  ],
                }}
                key="ellipsis"
              >
                <EllipsisOutlined />
              </Dropdown>,
            ]}
          >
            <Card.Meta
              avatar={<Avatar size="small" src={item.avatar} />}
              title={item.title}
            />
            <div>
              <CardInfo
                activeUser={formatWan(item.activeUser)}
                newUser={formatNumber(item.newUser)}
              />
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
}
