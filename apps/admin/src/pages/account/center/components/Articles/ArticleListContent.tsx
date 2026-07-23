// Ported from ant-design-pro-master's src/components/ArticleListContent
// (shared across several list pages there). Colocated here instead of a
// shared src/components/ location since this batch is scoped to
// apps/admin/src/pages/{profile,account}/** — if a later page (e.g. the
// list pages) needs this too, it's a good candidate to lift out to
// src/components/ at that point.
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

export default function ArticleListContent({
  data: { content, updatedAt, avatar, owner, href },
}: ArticleListContentProps) {
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
}
