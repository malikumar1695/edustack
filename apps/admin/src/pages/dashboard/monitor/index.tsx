import { Gauge, Liquid, WordCloud } from "@ant-design/plots";
import { GridContent } from "@ant-design/pro-components";
import { Card, Col, Progress, Row, Skeleton, Statistic } from "antd";
import { lazy, Suspense, useEffect, useState } from "react";
import { getTags } from "./_mock";
import ActiveChart from "./components/ActiveChart";
import { formatNumber } from "./utils/format";

const MonitorMap = lazy(() => import("./components/Map"));

const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;

const mapChartStyle = {
  flex: 1,
  minHeight: 420,
  marginTop: 16,
  position: "relative" as const,
};

/**
 * Ported from ant-design-pro-master's dashboard/monitor/index.tsx. The
 * original fetched its word-cloud tags via `@tanstack/react-query` +
 * `request('/api/tags')` (itself backed by a mockjs mock); apps/admin has
 * neither, so `getTags()` from `./_mock` is called directly and
 * synchronously — no loading state needed since there's no round trip.
 * The real Map component still does genuine `fetch()` calls to live
 * external CDNs (see components/Map/index.tsx) — that part is unchanged.
 */
const Monitor = () => {
  const [tags] = useState(() => getTags());

  useEffect(() => {
    document.title = "Monitor - Ant Design Pro";
  }, []);

  const wordCloudData = (tags.list || []).map((item) => {
    return {
      id: +Date.now(),
      word: item.name,
      weight: item.value,
    };
  });
  return (
    <GridContent>
      <Row gutter={24}>
        <Col
          xl={18}
          lg={24}
          md={24}
          sm={24}
          xs={24}
          style={{
            marginBottom: 24,
            display: "flex",
          }}
        >
          <Card
            title="Real-time Campaign Transactions"
            variant="borderless"
            style={{ flex: 1 }}
            styles={{
              body: { display: "flex", flexDirection: "column", flex: 1 },
            }}
          >
            <Row>
              <Col md={6} sm={12} xs={24}>
                <Statistic
                  title="Today's Total Transactions"
                  suffix="CNY"
                  value={formatNumber(124543233)}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <Statistic title="Sales Target Completion" value="92%" />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <Statistic.Timer
                  type="countdown"
                  title="Time Remaining"
                  value={deadline}
                  format="HH:mm:ss:SSS"
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <Statistic
                  title="Transactions per Second"
                  suffix="CNY"
                  value={formatNumber(234)}
                />
              </Col>
            </Row>
            <div style={mapChartStyle}>
              <Suspense
                fallback={
                  <Skeleton.Node active style={{ width: "100%", height: 356 }} />
                }
              >
                <MonitorMap />
              </Suspense>
            </div>
          </Card>
        </Col>
        <Col xl={6} lg={24} md={24} sm={24} xs={24}>
          <Card
            title="Campaign Forecast"
            style={{
              marginBottom: 24,
            }}
            variant="borderless"
          >
            <ActiveChart />
          </Card>
          <Card
            title="Coupon Verification Efficiency"
            style={{
              marginBottom: 24,
            }}
            styles={{
              body: {
                textAlign: "center",
              },
            }}
            variant="borderless"
          >
            <Gauge
              height={180}
              data={
                {
                  target: 80,
                  total: 100,
                  name: "score",
                  thresholds: [20, 40, 60, 80, 100],
                } as any
              }
              padding={-16}
              style={{
                textContent: () => "Excellent",
              }}
              meta={{
                color: {
                  range: ["#6395FA", "#62DAAB", "#657798", "#F7C128", "#1F8718"],
                },
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col
          xl={12}
          lg={24}
          sm={24}
          xs={24}
          style={{
            marginBottom: 24,
          }}
        >
          <Card title="Category Share" variant="borderless">
            <Row
              style={{
                padding: "16px 0",
              }}
            >
              <Col span={8}>
                <Progress type="dashboard" percent={75} />
              </Col>
              <Col span={8}>
                <Progress type="dashboard" percent={48} />
              </Col>
              <Col span={8}>
                <Progress type="dashboard" percent={33} />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col
          xl={6}
          lg={12}
          sm={24}
          xs={24}
          style={{
            marginBottom: 24,
          }}
        >
          <Card
            title="Trending Searches"
            variant="borderless"
            styles={{
              body: {
                overflow: "hidden",
              },
            }}
          >
            <WordCloud
              data={wordCloudData}
              height={162}
              textField="word"
              colorField="word"
              layout={{ spiral: "rectangular", fontSize: [10, 20] }}
            />
          </Card>
        </Col>
        <Col
          xl={6}
          lg={12}
          sm={24}
          xs={24}
          style={{
            marginBottom: 24,
          }}
        >
          <Card
            title="Remaining Resources"
            styles={{
              body: {
                textAlign: "center",
                fontSize: 0,
              },
            }}
            variant="borderless"
          >
            <Liquid height={160} percent={0.35} />
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
};
export default Monitor;
