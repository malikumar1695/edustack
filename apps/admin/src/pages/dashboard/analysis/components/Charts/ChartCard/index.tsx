import { Card } from "antd";
import type { CardProps } from "antd/es/card";
import type React from "react";

type totalType = () => React.ReactNode;

type ChartCardProps = {
  title: React.ReactNode;
  action?: React.ReactNode;
  total?: React.ReactNode | number | (() => React.ReactNode | number);
  footer?: React.ReactNode;
  contentHeight?: number;
  avatar?: React.ReactNode;
  style?: React.CSSProperties;
} & CardProps;

const ChartCardTotal: React.FC<{
  total?: number | totalType | React.ReactNode;
}> = ({ total }) => {
  if (!total && total !== 0) {
    return null;
  }
  const totalStyle: React.CSSProperties = {
    height: 38,
    marginTop: 4,
    marginBottom: 0,
    overflow: "hidden",
    color: "rgba(0, 0, 0, 0.88)",
    fontSize: 30,
    lineHeight: "38px",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    wordBreak: "break-all",
  };
  switch (typeof total) {
    case "undefined":
      return null;
    case "function":
      return <div style={totalStyle}>{(total as totalType)()}</div>;
    default:
      return <div style={totalStyle}>{total}</div>;
  }
};

const ChartCardContent: React.FC<ChartCardProps> = ({
  contentHeight,
  title,
  avatar,
  action,
  total,
  footer,
  children,
}) => (
  <div style={{ position: "relative" }}>
    <div
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        marginBottom: !children && !footer ? 12 : undefined,
      }}
    >
      <div style={{ position: "relative", top: 4, float: "left", marginRight: 20 }}>
        {avatar}
      </div>
      <div style={{ float: "left" }}>
        <div
          style={{
            height: 22,
            color: "rgba(0, 0, 0, 0.65)",
            fontSize: 14,
            lineHeight: "22px",
          }}
        >
          <span>{title}</span>
          <span
            style={{
              position: "absolute",
              top: 4,
              right: 0,
              lineHeight: 1,
              cursor: "pointer",
            }}
          >
            {action}
          </span>
        </div>
        <ChartCardTotal total={total} />
      </div>
    </div>
    {children && (
      <div
        style={{
          position: "relative",
          width: "100%",
          marginBottom: 12,
          height: contentHeight || "auto",
        }}
      >
        <div
          style={
            contentHeight
              ? { position: "absolute", bottom: 0, left: 0, width: "100%" }
              : undefined
          }
        >
          {children}
        </div>
      </div>
    )}
    {footer && (
      <div
        style={{
          marginTop: !children ? 20 : 8,
          paddingTop: 9,
          borderTop: "1px solid rgba(5, 5, 5, 0.06)",
        }}
      >
        {footer}
      </div>
    )}
  </div>
);

const ChartCard: React.FC<ChartCardProps> = (props) => {
  const { loading = false, total: _total, contentHeight: _contentHeight, action: _action, ...cardProps } = props;
  return (
    <Card
      loading={loading}
      styles={{
        body: {
          padding: "20px 24px 8px 24px",
        },
      }}
      {...cardProps}
    >
      {loading ? false : <ChartCardContent {...props} />}
    </Card>
  );
};
export default ChartCard;
