import { Card, List } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import type { ListItemDataType } from "../../_mock";
import { fakeList } from "../../_mock";
import AvatarList from "./AvatarList";

// Ported from ant-design-pro-master's src/app.tsx, which extended dayjs with
// this plugin globally in Umi's runtime config. Extended locally here since
// this is the only ported page (so far) that calls dayjs(...).fromNow() —
// dayjs.extend is idempotent, so this is safe even if called more than once.
dayjs.extend(relativeTime);

export default function Projects() {
  const [listData] = useState(() => fakeList(30));

  return (
    <List<ListItemDataType>
      rowKey="id"
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
        <List.Item>
          <Card
            style={{ marginBottom: 4 }}
            hoverable
            cover={<img alt={item.title} src={item.cover} />}
          >
            <Card.Meta
              title={<a href={item.href}>{item.title}</a>}
              description={item.subDescription}
              style={{ marginBottom: 4 }}
            />
            <div
              style={{
                display: "flex",
                height: 20,
                marginTop: 16,
                marginBottom: -4,
                lineHeight: "20px",
              }}
            >
              <span style={{ flex: 1, color: "rgba(0, 0, 0, 0.45)", fontSize: 12 }}>
                {dayjs(item.updatedAt).fromNow()}
              </span>
              <div style={{ flex: "0 1 auto" }}>
                <AvatarList size="small">
                  {item.members.map((member) => (
                    <AvatarList.Item
                      key={`${item.id}-avatar-${member.id}`}
                      src={member.avatar}
                      tips={member.name}
                    />
                  ))}
                </AvatarList>
              </div>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
}
