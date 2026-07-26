import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import type React from "react";

export type NumberInfoProps = {
  title?: React.ReactNode | string;
  subTitle?: React.ReactNode | string;
  renderSubTitle?: () => React.ReactNode;
  total?: React.ReactNode | string;
  status?: "up" | "down";
  theme?: string;
  gap?: number;
  subTotal?: number;
  suffix?: string;
  style?: React.CSSProperties;
};

/**
 * Ported from ant-design-pro-master's NumberInfo (antd-style -> inline
 * styles). The original's `theme` prop looked up a `numberInfo${theme}`
 * class that was never actually defined in its style file, so it was
 * already a no-op there — dropped here too.
 */
const NumberInfo: React.FC<NumberInfoProps> = ({
  title,
  subTitle,
  renderSubTitle,
  total,
  subTotal,
  status,
  suffix,
  gap,
  style,
}) => {
  const subTitleNode = renderSubTitle?.() ?? subTitle;
  const hasSubTitle = subTitleNode !== null && subTitleNode !== undefined;
  return (
    <div style={style}>
      {title && (
        <div
          style={{
            marginBottom: 16,
            color: "rgba(0, 0, 0, 0.88)",
            fontSize: 16,
          }}
          title={typeof title === "string" ? title : ""}
        >
          {title}
        </div>
      )}
      {hasSubTitle && (
        <div
          style={{
            height: 22,
            overflow: "hidden",
            color: "rgba(0, 0, 0, 0.65)",
            fontSize: 14,
            lineHeight: "22px",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            wordBreak: "break-all",
          }}
          title={typeof subTitleNode === "string" ? subTitleNode : ""}
        >
          {subTitleNode}
        </div>
      )}
      <div
        style={{
          marginTop: gap || 4,
          overflow: "hidden",
          fontSize: 0,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          wordBreak: "break-all",
        }}
      >
        <span style={{ color: "rgba(0, 0, 0, 0.88)" }}>
          {total}
          {suffix && (
            <em
              style={{
                marginLeft: 4,
                color: "rgba(0, 0, 0, 0.88)",
                fontSize: 16,
                fontStyle: "normal",
              }}
            >
              {suffix}
            </em>
          )}
        </span>
        {(status || subTotal) && (
          <span
            style={{
              marginRight: 0,
              color: "rgba(0, 0, 0, 0.65)",
              fontSize: 16,
              verticalAlign: "top",
            }}
          >
            {subTotal}
            {status && status === "up" ? (
              <CaretUpOutlined style={{ color: "#f5222d" }} />
            ) : (
              <CaretDownOutlined style={{ color: "#52c41a" }} />
            )}
          </span>
        )}
      </div>
    </div>
  );
};
export default NumberInfo;
