import { Line, Tiny } from "@ant-design/plots";
import { Card, Col, Row, Tabs } from "antd";
import type { DataItem, OfflineDataType } from "../data";

const CustomTab = ({ data }: { data: OfflineDataType; currentTabKey: string }) => (
  <Row
    gutter={8}
    style={{
      width: 138,
      margin: "8px 0",
    }}
  >
    <Col span={12}>
      <div style={{ fontSize: 14, lineHeight: "22px", marginBottom: 4 }}>
        {data.name}
      </div>
      <div
        style={{
          height: 22,
          overflow: "hidden",
          color: "rgba(0, 0, 0, 0.65)",
          fontSize: 14,
          lineHeight: "22px",
        }}
      >
        Conversion Rate
      </div>
      <div style={{ marginTop: 2, fontSize: 16, color: "rgba(0, 0, 0, 0.88)" }}>
        {`${data.cvr * 100}%`}
      </div>
    </Col>
    <Col
      span={12}
      style={{
        paddingTop: 36,
      }}
    >
      <Tiny.Ring
        height={60}
        width={60}
        percent={data.cvr}
        color={["#E8EEF4", "#5FABF4"]}
      />
    </Col>
  </Row>
);

const OfflineData = ({
  activeKey,
  loading,
  offlineData,
  offlineChartData,
  handleTabChange,
}: {
  activeKey: string;
  loading: boolean;
  offlineData: OfflineDataType[];
  offlineChartData: DataItem[];
  handleTabChange: (activeKey: string) => void;
}) => {
  return (
    <Card
      loading={loading}
      variant="borderless"
      style={{
        marginTop: 32,
      }}
    >
      <Tabs
        activeKey={activeKey}
        onChange={handleTabChange}
        items={offlineData.map((shop) => ({
          key: shop.name,
          label: <CustomTab data={shop} currentTabKey={activeKey} />,
          children: (
            <div
              style={{
                padding: "0 24px",
              }}
            >
              <Line
                height={400}
                data={offlineChartData}
                xField="date"
                yField="value"
                colorField="type"
                slider={{ x: true }}
                axis={{
                  x: { title: false },
                  y: {
                    title: false,
                    gridLineDash: null,
                    gridStroke: "#ccc",
                    gridStrokeOpacity: 1,
                  },
                }}
                legend={{
                  color: {
                    layout: { justifyContent: "center" },
                  },
                }}
              />
            </div>
          ),
        }))}
      />
    </Card>
  );
};
export default OfflineData;
