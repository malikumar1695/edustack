// Ported from ant-design-pro-master's src/components/AvatarList. Colocated
// here (see ArticleListContent.tsx's note in the sibling Articles/ folder
// for why) instead of a shared src/components/ location. Simplified: the
// original used `clsx` (not installed in apps/admin) to merge createStyles
// classes by size; since we're already converting createStyles to inline
// styles, size is resolved to a plain style object directly instead.
import { Avatar, Tooltip } from "antd";
import React from "react";

export type SizeType = number | "small" | "default" | "large";

export type AvatarItemProps = {
  tips: React.ReactNode;
  src: string;
  size?: SizeType;
  style?: React.CSSProperties;
  onClick?: () => void;
};

export type AvatarListProps = {
  size?: SizeType;
  maxLength?: number;
  excessItemsStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  children:
    | React.ReactElement<AvatarItemProps>
    | React.ReactElement<AvatarItemProps>[];
};

function itemSizeStyle(size?: SizeType): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "inline-block",
    width: 32,
    height: 32,
    marginLeft: -8,
    fontSize: 14,
  };
  if (size === "large") return { ...base, width: 40, height: 40 };
  if (size === "small") return { ...base, width: 24, height: 24 };
  return base;
}

const Item: React.FC<AvatarItemProps> = ({ src, size, tips, onClick }) => {
  const avatar = tips ? (
    <Tooltip title={tips}>
      <Avatar
        src={src}
        size={size}
        style={{ cursor: onClick ? "pointer" : undefined }}
      />
    </Tooltip>
  ) : (
    <Avatar src={src} size={size} />
  );

  return (
    <li style={itemSizeStyle(size)}>
      {onClick ? (
        <button
          type="button"
          style={{ padding: 0, border: 0, background: "transparent", cursor: "pointer" }}
          onClick={onClick}
        >
          {avatar}
        </button>
      ) : (
        avatar
      )}
    </li>
  );
};

const AvatarList: React.FC<AvatarListProps> & { Item: typeof Item } = ({
  children,
  size,
  maxLength = 5,
  excessItemsStyle,
  ...other
}) => {
  const numOfChildren = React.Children.count(children);
  const numToShow = maxLength >= numOfChildren ? numOfChildren : maxLength;
  const childrenArray = React.Children.toArray(
    children,
  ) as React.ReactElement<AvatarItemProps>[];
  const childrenWithProps = childrenArray
    .slice(0, numToShow)
    .map((child) => React.cloneElement(child, { size }));
  if (numToShow < numOfChildren) {
    childrenWithProps.push(
      <li key="exceed" style={itemSizeStyle(size)}>
        <Avatar size={size} style={excessItemsStyle}>{`+${numOfChildren - maxLength}`}</Avatar>
      </li>,
    );
  }
  return (
    <div {...other} style={{ display: "inline-block" }}>
      <ul style={{ display: "inline-block", marginLeft: 8, fontSize: 0 }}>
        {childrenWithProps}
      </ul>
    </div>
  );
};

AvatarList.Item = Item;

export default AvatarList;
