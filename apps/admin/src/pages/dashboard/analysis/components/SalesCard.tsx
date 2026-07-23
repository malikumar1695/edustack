import { Column } from "@ant-design/plots";
import { Button, Card, Col, DatePicker, Row, Tabs } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import { styles } from "../styles";
import { formatNumber } from "../utils/format";
import type { DataItem } from "../data";
import type { TimeType } from "../utils/utils";

const { RangePicker } = DatePicker;

const rankingListData: {
  title: string;
  total: number;
}[] = [];

for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `Main Street Store ${i}`,
    total: 323234,
  });
}

const SalesCard = ({
  rangePickerValue,
  salesData,
  isActive,
  handleRangePickerChange,
  loading,
  selectDate,
}: {
  rangePickerValue: RangePickerProps["value"];
  isActive: (key: TimeType) => boolean;
  salesData: DataItem[];
  loading: boolean;
  handleRangePickerChange: RangePickerProps["onChange"];
  selectDate: (key: TimeType) => void;
}) => {
  const activeStyle = (key: TimeType) =>
    isActive(key) ? styles.currentDate : undefined;
  return (
    <Card
      loading={loading}
      variant="borderless"
      styles={{
        body: {
          padding: loading ? 24 : 0,
        },
      }}
    >
      <Tabs
        tabBarExtraContent={
          <div>
            <div style={styles.salesExtra}>
              <Button
                type="text"
                style={activeStyle("today")}
                onClick={() => selectDate("today")}
              >
                Today
              </Button>
              <Button
                type="text"
                style={activeStyle("week")}
                onClick={() => selectDate("week")}
              >
                This Week
              </Button>
              <Button
                type="text"
                style={activeStyle("month")}
                onClick={() => selectDate("month")}
              >
                This Month
              </Button>
              <Button
                type="text"
                style={activeStyle("year")}
                onClick={() => selectDate("year")}
              >
                This Year
              </Button>
            </div>
            <RangePicker
              value={rangePickerValue}
              onChange={handleRangePickerChange}
              variant="filled"
              style={{
                width: 256,
              }}
            />
          </div>
        }
        size="large"
        tabBarStyle={{
          marginBottom: 24,
        }}
        items={[
          {
            key: "sales",
            label: "Sales",
            children: (
              <Row>
                <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                  <div style={styles.salesBar}>
                    <Column
                      height={300}
                      data={salesData}
                      xField="x"
                      yField="y"
                      paddingBottom={12}
                      axis={{
                        x: {
                          title: false,
                        },
                        y: {
                          title: false,
                          gridLineDash: null,
                          gridStroke: "#ccc",
                        },
                      }}
                      scale={{
                        x: { paddingInner: 0.4 },
                      }}
                      tooltip={{
                        name: "Sales Volume",
                        channel: "y",
                      }}
                    />
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                  <div style={styles.salesRank}>
                    <h4 style={styles.rankingTitle}>Store Sales Ranking</h4>
                    <ul style={styles.rankingList}>
                      {rankingListData.map((item, i) => (
                        <li key={item.title} style={styles.rankingListItem}>
                          <span
                            style={
                              i < 3
                                ? styles.rankingItemNumberActive
                                : styles.rankingItemNumber
                            }
                          >
                            {i + 1}
                          </span>
                          <span style={styles.rankingItemTitle} title={item.title}>
                            {item.title}
                          </span>
                          <span>{formatNumber(item.total)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>
              </Row>
            ),
          },
          {
            key: "views",
            label: "Visits",
            children: (
              <Row>
                <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                  <div style={styles.salesBar}>
                    <Column
                      height={300}
                      data={salesData}
                      xField="x"
                      yField="y"
                      paddingBottom={12}
                      axis={{
                        x: {
                          title: false,
                        },
                        y: {
                          title: false,
                        },
                      }}
                      scale={{
                        x: { paddingInner: 0.4 },
                      }}
                      tooltip={{
                        name: "Visits",
                        channel: "y",
                      }}
                    />
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                  <div style={styles.salesRank}>
                    <h4 style={styles.rankingTitle}>Store Visits Ranking</h4>
                    <ul style={styles.rankingList}>
                      {rankingListData.map((item, i) => (
                        <li key={item.title} style={styles.rankingListItem}>
                          <span
                            style={
                              i < 3
                                ? styles.rankingItemNumberActive
                                : styles.rankingItemNumber
                            }
                          >
                            {i + 1}
                          </span>
                          <span style={styles.rankingItemTitle} title={item.title}>
                            {item.title}
                          </span>
                          <span>{formatNumber(item.total)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>
              </Row>
            ),
          },
        ]}
      />
    </Card>
  );
};
export default SalesCard;
