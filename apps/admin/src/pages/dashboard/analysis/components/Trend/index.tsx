import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import type React from "react";

type TrendProps = {
  colorful?: boolean;
  flag: "up" | "down";
  style?: React.CSSProperties;
  reverseColor?: boolean;
  children?: React.ReactNode;
  title?: string;
};

/**
 * Ported from ant-design-pro-master's Trend (antd-style -> inline styles).
 * The original's `trendItemGrey`/`reverseColor` variants nested `up`/`down`
 * as plain object keys rather than real CSS selectors, so they never
 * actually applied in the source either; every caller in this batch uses
 * the default colorful look, so that dead branch is dropped here.
 */
const Trend: React.FC<TrendProps> = ({ flag, children, title = "", style }) => {
  return (
    <div
      style={{ display: "inline-block", fontSize: 14, lineHeight: "22px", ...style }}
      title={title}
    >
      <span>{children}</span>
      {flag && (
        <span style={{ color: flag === "up" ? "#f5222d" : "#52c41a" }}>
          {flag === "up" ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </span>
      )}
    </div>
  );
};
export default Trend;
