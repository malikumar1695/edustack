import { Area } from "@ant-design/plots";
import { Statistic } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";

function fixedZero(val: number) {
  return val * 1 < 10 ? `0${val}` : val;
}
function getActiveData() {
  const activeData = [];
  for (let i = 0; i < 24; i += 1) {
    activeData.push({
      x: `${fixedZero(i)}:00`,
      y: Math.floor(Math.random() * 200) + i * 50,
    });
  }
  return activeData;
}

/**
 * Ported from ant-design-pro-master's ActiveChart (antd-style -> inline
 * styles). The `p:last-child` / `dashedLine:last-child` nested selectors
 * from the original can't be expressed as inline styles, so the two grid
 * labels and two dashed lines are positioned directly per-element instead
 * of via shared classes — same visual result.
 */
const ActiveChart = () => {
  const timerRef = useRef<number | null>(null);
  const [activeData, setActiveData] = useState<{ x: string; y: number }[]>(
    () => getActiveData(),
  );

  useEffect(() => {
    const loopData = () => {
      setActiveData(getActiveData());
      timerRef.current = window.setTimeout(loopData, 2000);
    };
    timerRef.current = window.setTimeout(loopData, 2000);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const { maxValue, medianValue } = useMemo(() => {
    if (!activeData.length) return { maxValue: 0, medianValue: 0 };
    const sorted = [...activeData].sort((a, b) => a.y - b.y);
    return {
      maxValue: sorted[sorted.length - 1]?.y ?? 0,
      medianValue: sorted[Math.floor(sorted.length / 2)]?.y ?? 0,
    };
  }, [activeData]);

  return (
    <div style={{ position: "relative" }}>
      <Statistic title="Goal Assessment" value="On Track to Meet Target" />
      <div
        style={{
          marginTop: 32,
        }}
      >
        <Area
          padding={[0, 0, 0, 0]}
          xField="x"
          axis={false}
          yField="y"
          height={84}
          style={{
            fill: "linear-gradient(-90deg, white 0%, #6294FA 100%)",
            fillOpacity: 0.6,
          }}
          data={activeData}
        />
      </div>
      {activeData && (
        <div>
          <div style={{ position: "relative" }}>
            <p style={{ position: "absolute", top: 80 }}>{maxValue + 200}M CNY</p>
            <p style={{ position: "absolute", top: 115 }}>{medianValue}M CNY</p>
          </div>
          <div style={{ position: "relative", top: -70, left: -3, height: 1 }}>
            <div style={dashedLineStyle} />
          </div>
          <div style={{ position: "relative", top: -36, left: -3, height: 1 }}>
            <div style={dashedLineStyle} />
          </div>
        </div>
      )}
      {activeData && (
        <div
          style={{
            position: "relative",
            height: 20,
            marginTop: 8,
            fontSize: 0,
            lineHeight: "20px",
            display: "flex",
          }}
        >
          <span style={{ width: "33.33%", fontSize: 12, textAlign: "left" }}>
            00:00
          </span>
          <span style={{ width: "33.33%", fontSize: 12, textAlign: "center" }}>
            {activeData[Math.floor(activeData.length / 2)]?.x}
          </span>
          <span style={{ width: "33.33%", fontSize: 12, textAlign: "right" }}>
            {activeData[activeData.length - 1]?.x}
          </span>
        </div>
      )}
    </div>
  );
};

const dashedLineStyle = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage: "linear-gradient(to right, transparent 50%, #e9e9e9 50%)",
  backgroundSize: "6px",
};

export default ActiveChart;
