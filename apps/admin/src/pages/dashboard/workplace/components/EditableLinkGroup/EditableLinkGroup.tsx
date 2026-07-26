import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import type React from "react";
import { createElement } from "react";

export type EditableLink = {
  title: string;
  href: string;
  id?: string;
};
type EditableLinkGroupProps = {
  onAdd: () => void;
  links: EditableLink[];
  linkElement: any;
};

/**
 * Ported from ant-design-pro-master's EditableLinkGroup (antd-style ->
 * inline styles). The original's `&:hover` link-color rule can't be
 * expressed as an inline style, so it's dropped (cosmetic polish only).
 */
const EditableLinkGroup: React.FC<EditableLinkGroupProps> = (props) => {
  const { links = [], linkElement = "a", onAdd = () => {} } = props;
  return (
    <div style={{ fontSize: 0 }}>
      {links.map((link) =>
        createElement(
          linkElement,
          {
            key: `linkGroup-item-${link.id || link.title}`,
            to: link.href,
            href: link.href,
            style: {
              display: "inline-block",
              width: "25%",
              marginBottom: 13,
              color: "rgba(0, 0, 0, 0.88)",
              fontSize: 14,
            },
          },
          link.title,
        ),
      )}
      <Button size="small" type="primary" ghost onClick={onAdd}>
        <PlusOutlined /> Add
      </Button>
    </div>
  );
};

export default EditableLinkGroup;
