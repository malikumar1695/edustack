/**
 * Ported from ant-design-pro-master/src/pages/list/search/applications/index.tsx.
 * Original used `@tanstack/react-query`'s useQuery; admin doesn't have that
 * dependency, so this uses plain useState + useEffect (re-fetching on form
 * change). Original also used `createStyles` (antd-style) for a couple of
 * rules — inlined here. `formatNumber` (originally `@/utils/format`) is
 * inlined locally since it's a two-line `Intl.NumberFormat` wrapper only
 * used on this page. One small fix versus the original: the Dropdown menu
 * items used `title` instead of antd's `label` field, so the "1st/2nd menu
 * item" text never actually rendered in the source demo either — switched
 * to `label` here so the dropdown has visible content.
 */
import {
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  Col,
  Dropdown,
  Form,
  List,
  Row,
  Select,
  Tooltip,
} from "antd";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import StandardFormRow from "../components/StandardFormRow";
import TagSelect from "../components/TagSelect";
import { categoryOptions } from "../../mock/mock";
import type { ListItemDataType } from "./data";
import { queryFakeList } from "./mockData";

const numberFormatter = new Intl.NumberFormat("en-US");
const formatNumber = (val: number | string): string => {
  const parsed = Number(val);
  return Number.isFinite(parsed) ? numberFormatter.format(parsed) : "";
};

function formatWan(val: number) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return "";
  let result: React.ReactNode = val;
  if (val > 10000) {
    result = (
      <span>
        {Math.floor(val / 10000)}
        <span
          style={{
            position: "relative",
            top: -2,
            fontSize: 14,
            fontStyle: "normal",
            marginLeft: 2,
          }}
        >
          0K
        </span>
      </span>
    );
  }
  return result;
}
const formItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const CardInfo: React.FC<{
  activeUser: React.ReactNode;
  newUser: React.ReactNode;
}> = ({ activeUser, newUser }) => {
  return (
    <div style={{ marginTop: 16, marginLeft: 40 }}>
      <div style={{ position: "relative", float: "left", width: "50%", textAlign: "left" }}>
        <p style={{ margin: 0, marginBottom: 4, color: "rgba(0, 0, 0, 0.45)", fontSize: 12, lineHeight: "20px" }}>
          Active Users
        </p>
        <p style={{ margin: 0, fontSize: 24, lineHeight: "32px" }}>{activeUser}</p>
      </div>
      <div style={{ position: "relative", float: "left", width: "50%", textAlign: "left" }}>
        <p style={{ margin: 0, marginBottom: 4, color: "rgba(0, 0, 0, 0.45)", fontSize: 12, lineHeight: "20px" }}>
          New Users
        </p>
        <p style={{ margin: 0, fontSize: 24, lineHeight: "32px" }}>{newUser}</p>
      </div>
    </div>
  );
};
const Applications: FC<Record<string, any>> = () => {
  const [list, setList] = useState<ListItemDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    document.title = "Search List (Applications) - Ant Design Pro";
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    queryFakeList({ count: 8 }).then((res) => {
      if (!cancelled) {
        setList(res.data.list);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const refetch = () => setRefreshKey((k) => k + 1);

  return (
    <div>
      <Card variant="borderless">
        <Form
          onValuesChange={() => {
            refetch();
          }}
        >
          <StandardFormRow
            title="Category"
            block
            style={{
              paddingBottom: 11,
            }}
          >
            <Form.Item name="category">
              <TagSelect expandable>
                {categoryOptions.flatMap((category) =>
                  category.value !== undefined && category.value !== null
                    ? [
                        <TagSelect.Option
                          value={category.value}
                          key={category.value}
                        >
                          {category.label}
                        </TagSelect.Option>,
                      ]
                    : [],
                )}
              </TagSelect>
            </Form.Item>
          </StandardFormRow>
          <StandardFormRow title="Other Options" grid last>
            <Row gutter={16}>
              <Col lg={8} md={10} sm={10} xs={24}>
                <Form.Item {...formItemLayout} name="author" label="Author">
                  <Select
                    placeholder="No limit"
                    style={{
                      maxWidth: 200,
                      width: "100%",
                    }}
                    options={[
                      {
                        label: "Wang Zhaojun",
                        value: "lisa",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col lg={8} md={10} sm={10} xs={24}>
                <Form.Item {...formItemLayout} name="rate" label="Rating">
                  <Select
                    placeholder="No limit"
                    style={{
                      maxWidth: 200,
                      width: "100%",
                    }}
                    options={[
                      {
                        label: "Excellent",
                        value: "good",
                      },
                      {
                        label: "Average",
                        value: "normal",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </StandardFormRow>
        </Form>
      </Card>
      <br />
      <List<ListItemDataType>
        rowKey="id"
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        loading={loading}
        dataSource={list}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card
              hoverable
              styles={{
                body: {
                  paddingBottom: 20,
                },
              }}
              actions={[
                <Tooltip key="download" title="Download">
                  <DownloadOutlined />
                </Tooltip>,
                <Tooltip key="edit" title="Edit">
                  <EditOutlined />
                </Tooltip>,
                <Tooltip title="Share" key="share">
                  <ShareAltOutlined />
                </Tooltip>,
                <Dropdown
                  key="ellipsis"
                  menu={{
                    items: [
                      {
                        key: "1",
                        label: "1st menu item",
                      },
                      {
                        key: "2",
                        label: "2st menu item",
                      },
                    ],
                  }}
                >
                  <EllipsisOutlined />
                </Dropdown>,
              ]}
            >
              <Card.Meta
                avatar={<Avatar size="small" src={item.avatar} />}
                title={item.title}
              />
              <div>
                <CardInfo
                  activeUser={formatWan(item.activeUser)}
                  newUser={formatNumber(item.newUser)}
                />
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default Applications;
