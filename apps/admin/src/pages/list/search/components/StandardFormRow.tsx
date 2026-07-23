/**
 * Ported from ant-design-pro-master/src/components/StandardFormRow
 * (used by list/search/{articles,projects,applications}). Original used
 * `createStyles` (antd-style) + `clsx`; neither is installed in admin, so
 * this uses inline styles built up per the `block`/`last`/`grid` flags.
 */
import React from "react";

type StandardFormRowProps = {
  title?: string;
  last?: boolean;
  block?: boolean;
  grid?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

const StandardFormRow: React.FC<StandardFormRowProps> = ({
  title,
  children,
  last,
  block,
  grid,
  style,
}) => {
  const rowStyle: React.CSSProperties = {
    display: "flex",
    width: "100%",
    marginBottom: last ? 0 : 16,
    paddingBottom: last ? 0 : 16,
    borderBottom: last ? "none" : "1px dashed rgba(5, 5, 5, 0.06)",
    ...style,
  };
  const contentStyle: React.CSSProperties = {
    flex: "1 1 0",
    ...((block || grid) && { display: "block" }),
  };

  return (
    <div style={rowStyle}>
      {title && (
        <div
          style={{
            flex: "0 0 auto",
            marginRight: 24,
            color: "rgba(0, 0, 0, 0.88)",
            textAlign: "right",
            lineHeight: "32px",
          }}
        >
          <span>{title}</span>
        </div>
      )}
      <div style={contentStyle}>{children}</div>
    </div>
  );
};

export default StandardFormRow;
