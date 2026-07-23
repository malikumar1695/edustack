/**
 * Ported from ant-design-pro-master/src/components/ArticleListContent
 * (used only by list/search/articles). The original used `createStyles`
 * from antd-style; admin doesn't have that dependency, so the styling is
 * inlined directly instead.
 */
import { Avatar } from "antd";
import dayjs from "dayjs";
import React from "react";

export type ArticleListContentProps = {
  data: {
    content?: React.ReactNode;
    updatedAt?: number;
    avatar?: string;
    owner?: string;
    href?: string;
  };
};

const ArticleListContent: React.FC<ArticleListContentProps> = ({
  data: { content, updatedAt, avatar, owner, href },
}) => {
  return (
    <div>
      <div style={{ maxWidth: 720, lineHeight: "22px" }}>{content}</div>
      <div
        style={{
          marginTop: 16,
          color: "rgba(0, 0, 0, 0.45)",
          lineHeight: "22px",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <Avatar src={avatar} size="small" />
        <a href={href}>{owner}</a> published at <a href={href}>{href}</a>
        <em style={{ color: "rgba(0, 0, 0, 0.25)", fontStyle: "normal" }}>
          {dayjs(updatedAt).format("YYYY-MM-DD HH:mm")}
        </em>
      </div>
    </div>
  );
};

export default ArticleListContent;
