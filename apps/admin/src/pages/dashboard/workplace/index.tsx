import { Radar } from "@ant-design/plots";
import { PageContainer } from "@ant-design/pro-components";
import { Avatar, Card, Col, List, Row, Skeleton, Statistic } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditableLinkGroup from "./components/EditableLinkGroup";
import { getActivities, getProjectNotice, getWorkplaceChartData } from "./_mock";
import type { ActivitiesType, CurrentUser } from "./data";

/**
 * `dayjs().fromNow()` is used below. Umi Max's `moment2dayjs` plugin
 * auto-extends dayjs with `relativeTime` (and friends) globally at
 * startup; outside Umi that has to be done explicitly, same gotcha as the
 * antd locale fix on the login page.
 */
dayjs.extend(relativeTime);

const links = [
  { title: "Action One", href: "" },
  { title: "Action Two", href: "" },
  { title: "Action Three", href: "" },
  { title: "Action Four", href: "" },
  { title: "Action Five", href: "" },
  { title: "Action Six", href: "" },
];

const pageHeaderContentStyle: React.CSSProperties = { display: "flex" };
const avatarWrapStyle: React.CSSProperties = { flex: "0 1 72px" };
const contentStyle: React.CSSProperties = {
  position: "relative",
  top: 4,
  flex: "1 1 auto",
  marginLeft: 24,
  color: "rgba(0, 0, 0, 0.65)",
  lineHeight: "22px",
};
const contentTitleStyle: React.CSSProperties = {
  marginBottom: 12,
  color: "rgba(0, 0, 0, 0.88)",
  fontWeight: 500,
  fontSize: 20,
  lineHeight: "28px",
};

const PageHeaderContent: React.FC<{ currentUser: Partial<CurrentUser> }> = ({
  currentUser,
}) => {
  const loading = currentUser && Object.keys(currentUser).length;
  if (!loading) {
    return <Skeleton avatar paragraph={{ rows: 1 }} active />;
  }
  return (
    <div style={pageHeaderContentStyle}>
      <div style={avatarWrapStyle}>
        <Avatar size="large" src={currentUser.avatar} />
      </div>
      <div style={contentStyle}>
        <div style={contentTitleStyle}>
          Good morning,
          {currentUser.name}
          , wishing you a great day!
        </div>
        <div>
          {currentUser.title} | {currentUser.group}
        </div>
      </div>
    </div>
  );
};

const extraContentStyle: React.CSSProperties = {
  whiteSpace: "nowrap",
};
const statItemStyle: React.CSSProperties = {
  position: "relative",
  display: "inline-block",
  padding: "0 32px",
};

const ExtraContent: React.FC = () => {
  return (
    <div style={extraContentStyle}>
      <div style={statItemStyle}>
        <Statistic title="Projects" value={56} />
      </div>
      <div style={statItemStyle}>
        <Statistic title="Team Ranking" value={8} suffix="/ 24" />
      </div>
      <div style={statItemStyle}>
        <Statistic title="Project Visits" value={2223} />
      </div>
    </div>
  );
};

const datetimeStyle: React.CSSProperties = {
  flex: "0 0 auto",
  color: "rgba(0, 0, 0, 0.45)",
};
const usernameStyle: React.CSSProperties = { color: "rgba(0, 0, 0, 0.88)" };

/**
 * Ported from ant-design-pro-master's dashboard/workplace/index.tsx.
 * `useModel('@@initialState')` isn't used here — the original hardcoded
 * `currentUser` inline as a prop to `PageHeaderContent` rather than
 * pulling it from global state, so there was nothing to swap for
 * `useAuth()`. Data fetching (`@tanstack/react-query` + `request(...)`)
 * is replaced with plain synchronous calls into `./_mock` (see there for
 * what was simplified out of the radar chart data).
 */
const Workplace = () => {
  const [projectNotice] = useState(() => getProjectNotice());
  const [activities] = useState(() => getActivities());
  const [chartData] = useState(() => getWorkplaceChartData());

  useEffect(() => {
    document.title = "Workplace - Ant Design Pro";
  }, []);

  const renderActivities = (item: ActivitiesType) => {
    const events = item.template.split(/@\{([^{}]*)\}/gi).map((key) => {
      if (item[key as keyof ActivitiesType]) {
        const value = item[key as "user"];
        return (
          <a href={value?.link} key={value?.name}>
            {value.name}
          </a>
        );
      }
      return key;
    });
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          avatar={<Avatar src={item.user.avatar} />}
          title={
            <span>
              <a style={usernameStyle} href={item.user.link || "/"}>
                {item.user.name}
              </a>
              &nbsp;
              <span style={{ fontWeight: "normal" }}>{events}</span>
            </span>
          }
          description={
            <span style={datetimeStyle} title={item.updatedAt}>
              {dayjs(item.updatedAt).fromNow()}
            </span>
          }
        />
      </List.Item>
    );
  };

  return (
    <PageContainer
      content={
        <PageHeaderContent
          currentUser={{
            avatar:
              "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
            name: "John Smith",
            userid: "00000001",
            email: "antdesign@alipay.com",
            signature:
              "The sea admits hundreds of rivers; broadmindedness makes one great.",
            title: "Interaction Expert",
            group: "Ant Group - Example BU - Example Platform Dept - Example Tech Dept - UED",
          }}
        />
      }
      extraContent={<ExtraContent />}
    >
      <Row gutter={24}>
        <Col xl={16} lg={24} md={24} sm={24} xs={24}>
          <Card
            style={{ marginBottom: 24 }}
            title="Projects in Progress"
            variant="borderless"
            extra={<Link to="/">All Projects</Link>}
          >
            {projectNotice.map((item) => (
              <Card.Grid style={{ width: "33.33%" }} key={item.id}>
                <Card.Meta
                  title={
                    <div style={{ fontSize: 0 }}>
                      <Avatar size="small" src={item.logo} />
                      <Link
                        to={item.href || "/"}
                        style={{ marginLeft: 12, color: "rgba(0, 0, 0, 0.88)" }}
                      >
                        {item.title}
                      </Link>
                    </div>
                  }
                  description={item.description}
                  style={{ width: "100%" }}
                />
                <div
                  style={{
                    display: "flex",
                    height: 20,
                    marginTop: 8,
                    overflow: "hidden",
                    fontSize: 12,
                    lineHeight: "20px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Link to={item.memberLink || "/"} style={{ flex: 1, color: "rgba(0, 0, 0, 0.65)" }}>
                    {item.member || ""}
                  </Link>
                  {item.updatedAt && (
                    <span style={datetimeStyle} title={item.updatedAt}>
                      {dayjs(item.updatedAt).fromNow()}
                    </span>
                  )}
                </div>
              </Card.Grid>
            ))}
          </Card>
          <Card
            variant="borderless"
            title="Activity"
            styles={{ body: { padding: 0 } }}
          >
            <List<ActivitiesType>
              renderItem={(item) => renderActivities(item)}
              dataSource={activities}
              style={{ padding: 0 }}
              size="large"
            />
          </Card>
        </Col>
        <Col xl={8} lg={24} md={24} sm={24} xs={24}>
          <Card style={{ marginBottom: 24 }} title="Quick Start / Shortcuts" variant="borderless">
            <EditableLinkGroup onAdd={() => {}} links={links} linkElement={Link} />
          </Card>
          <Card style={{ marginBottom: 24 }} variant="borderless" title="XX Index">
            <Radar
              height={343}
              data={chartData.radarData || []}
              xField="label"
              colorField="name"
              yField="value"
              shapeField="smooth"
              area={{
                style: {
                  fillOpacity: 0.4,
                },
              }}
              axis={{
                y: {
                  gridStrokeOpacity: 0.5,
                },
              }}
              legend={{
                color: {
                  position: "bottom",
                  layout: { justifyContent: "center" },
                },
              }}
            />
          </Card>
          <Card
            styles={{ body: { paddingTop: 12, paddingBottom: 12 } }}
            variant="borderless"
            title="Team"
          >
            <div>
              <Row gutter={48}>
                {projectNotice.map((item) => {
                  return (
                    <Col span={12} key={`members-item-${item.id}`}>
                      <Link
                        to={item.memberLink || "/"}
                        style={{
                          display: "block",
                          height: 24,
                          margin: "12px 0",
                          color: "rgba(0, 0, 0, 0.88)",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <Avatar src={item.logo} size="small" />
                        <span style={{ marginLeft: 12, fontSize: 14, verticalAlign: "top" }}>
                          {item.member.substring(0, 3)}
                        </span>
                      </Link>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
export default Workplace;
