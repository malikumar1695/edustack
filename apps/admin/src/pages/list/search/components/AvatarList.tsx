/**
 * Ported from ant-design-pro-master/src/components/AvatarList
 * (used only by list/search/projects). Original used `createStyles`
 * (antd-style) + `clsx`; neither is installed in admin, so this uses
 * inline styles.
 */
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

const sizeToDimension = (size?: SizeType): number => {
  if (size === "large") return 40;
  if (size === "small") return 24;
  if (typeof size === "number") return size;
  return 32;
};

const Item: React.FC<AvatarItemProps> = ({ src, size, tips, onClick }) => {
  const dimension = sizeToDimension(size);
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
    <li
      style={{
        display: "inline-block",
        width: dimension,
        height: dimension,
        marginLeft: -8,
      }}
    >
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

const AvatarList: React.FC<AvatarListProps> & {
  Item: typeof Item;
} = ({ children, size, maxLength = 5, excessItemsStyle, style }) => {
  const numOfChildren = React.Children.count(children);
  const numToShow = maxLength >= numOfChildren ? numOfChildren : maxLength;
  const childrenArray = React.Children.toArray(
    children,
  ) as React.ReactElement<AvatarItemProps>[];
  const childrenWithProps = childrenArray.slice(0, numToShow).map((child) =>
    React.cloneElement(child, {
      size,
    }),
  );
  if (numToShow < numOfChildren) {
    const dimension = sizeToDimension(size);
    childrenWithProps.push(
      <li
        key="exceed"
        style={{
          display: "inline-block",
          width: dimension,
          height: dimension,
          marginLeft: -8,
        }}
      >
        <Avatar size={size} style={excessItemsStyle}>{`+${
          numOfChildren - maxLength
        }`}</Avatar>
      </li>,
    );
  }
  return (
    <div style={{ display: "inline-block", ...style }}>
      <ul style={{ display: "inline-block", marginLeft: 8, fontSize: 0 }}>
        {childrenWithProps}
      </ul>
    </div>
  );
};

AvatarList.Item = Item;

export default AvatarList;
