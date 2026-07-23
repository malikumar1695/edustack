import type React from "react";

export type FieldProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  style?: React.CSSProperties;
};
const Field: React.FC<FieldProps> = ({ label, value, style }) => {
  return (
    <div
      style={{
        margin: 0,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        ...style,
      }}
    >
      <span style={{ fontSize: 14, lineHeight: "22px" }}>{label}</span>
      <span style={{ marginLeft: 8, color: "rgba(0, 0, 0, 0.88)" }}>
        {value}
      </span>
    </div>
  );
};
export default Field;
