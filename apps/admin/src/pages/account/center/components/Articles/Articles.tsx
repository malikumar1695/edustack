import { LikeOutlined, MessageFilled, StarTwoTone } from "@ant-design/icons";
import { Flex, List, Tag } from "antd";
import React, { useState } from "react";
import type { ListItemDataType } from "../../_mock";
import { fakeList } from "../../_mock";
import ArticleListContent from "./ArticleListContent";

const IconText: React.FC<{
  icon: React.ReactNode;
  text: React.ReactNode;
}> = ({ icon, text }) => (
  <span>
    {icon} {text}
  </span>
);

export default function Articles() {
  const [listData] = useState(() => fakeList(30));

  return (
    <List<ListItemDataType>
      size="large"
      rowKey="id"
      itemLayout="vertical"
      dataSource={listData}
      style={{ margin: "0 -24px" }}
      renderItem={(item) => (
        <List.Item
          key={item.id}
          actions={[
            <IconText key="star" icon={<StarTwoTone />} text={item.star} />,
            <IconText key="like" icon={<LikeOutlined />} text={item.like} />,
            <IconText
              key="message"
              icon={<MessageFilled />}
              text={item.message}
            />,
          ]}
        >
          <List.Item.Meta
            title={<a href={item.href}>{item.title}</a>}
            description={
              <Flex wrap gap="small">
                <Tag>Ant Design</Tag>
                <Tag>Design Language</Tag>
                <Tag>Ant Group</Tag>
              </Flex>
            }
          />
          <ArticleListContent data={item} />
        </List.Item>
      )}
    />
  );
}
