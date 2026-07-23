import { InfoCircleOutlined } from '@ant-design/icons';
import { Area, Column } from '@ant-design/plots';
import { Col, Progress, Row, Tooltip } from 'antd';
import { formatNumber } from '@/utils/format';
import type { DataItem } from '../data';
import useStyles from '../style.style';
import Yuan from '../utils/Yuan';
import ChartCard from './Charts/ChartCard';
import Field from './Charts/Field';
import Trend from './Trend';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};
const IntroduceRow = ({
  loading,
  visitData,
}: {
  loading: boolean;
  visitData: DataItem[];
}) => {
  const { styles } = useStyles();
  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          variant="borderless"
          title="Total Sales"
          action={
            <Tooltip title="Metric description">
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => <Yuan>126560</Yuan>}
          footer={
            <Field label="Daily Sales" value={`¥${formatNumber(12423)}`} />
          }
          contentHeight={46}
        >
          <Trend
            flag="up"
            style={{
              marginRight: 16,
            }}
          >
            Week-over-Week
            <span className={styles.trendText}>12%</span>
          </Trend>
          <Trend flag="down">
            Day-over-Day
            <span className={styles.trendText}>11%</span>
          </Trend>
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          variant="borderless"
          loading={loading}
          title="Visits"
          action={
            <Tooltip title="Metric description">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={formatNumber(8846)}
          footer={<Field label="Daily Visits" value={formatNumber(1234)} />}
          contentHeight={46}
        >
          <Area
            xField="x"
            yField="y"
            shapeField="smooth"
            height={46}
            axis={false}
            style={{
              fill: 'linear-gradient(-90deg, white 0%, #975FE4 100%)',
              fillOpacity: 0.6,
              width: '100%',
            }}
            padding={-20}
            data={visitData}
          />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          variant="borderless"
          loading={loading}
          title="Payments"
          action={
            <Tooltip title="Metric description">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={formatNumber(6560)}
          footer={<Field label="Conversion Rate" value="60%" />}
          contentHeight={46}
        >
          <Column
            xField="x"
            yField="y"
            padding={-20}
            axis={false}
            height={46}
            data={visitData}
            scale={{ x: { paddingInner: 0.4 } }}
          />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          variant="borderless"
          title="Campaign Performance"
          action={
            <Tooltip title="Metric description">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total="78%"
          footer={
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <Trend
                flag="up"
                style={{
                  marginRight: 16,
                }}
              >
                Week-over-Week
                <span className={styles.trendText}>12%</span>
              </Trend>
              <Trend flag="down">
                Day-over-Day
                <span className={styles.trendText}>11%</span>
              </Trend>
            </div>
          }
          contentHeight={46}
        >
          <Progress
            percent={78}
            strokeColor={{ from: '#108ee9', to: '#87d068' }}
            status="active"
          />
        </ChartCard>
      </Col>
    </Row>
  );
};
export default IntroduceRow;
