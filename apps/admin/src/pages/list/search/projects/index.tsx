/**
 * Ported from ant-design-pro-master/src/pages/list/search/projects/index.tsx.
 * Original used `@tanstack/react-query`'s useQuery; admin doesn't have that
 * dependency, so this uses plain useState + useEffect, re-fetching whenever
 * the filter form changes. Original also used `createStyles` (antd-style)
 * for card styling — inlined here (the `:hover` title-color rule is
 * dropped, inline styles can't express hover). `dayjs().fromNow()` needs
 * the `relativeTime` plugin, which ships inside the `dayjs` package itself
 * (no extra install) — extended once at the top of this file.
 */
import { Card, Col, Form, List, Row, Select, Typography } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { FC } from "react";
import { useEffect, useState } from "react";
import AvatarList from "../components/AvatarList";
import StandardFormRow from "../components/StandardFormRow";
import TagSelect from "../components/TagSelect";
import { categoryOptions } from "../../mock";
import type { ListItemDataType } from "./data";
import { queryFakeList } from "./mockData";

dayjs.extend(relativeTime);

const FormItem = Form.Item;
const { Paragraph } = Typography;
const getKey = (id: string, index: number) => `${id}-${index}`;
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

const Projects: FC = () => {
  const [filters, setFilters] = useState<{
    category?: (string | number)[];
    author?: string;
  }>({});
  const [list, setList] = useState<ListItemDataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Search List (Projects) - Ant Design Pro";
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    queryFakeList({ count: 8, ...filters }).then((res) => {
      if (!cancelled) {
        setList(res.data.list);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const run = (values: any) => {
    setFilters(values);
  };
  const cardList = list && (
    <List<ListItemDataType>
      rowKey="id"
      loading={loading}
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 4,
        xxl: 4,
      }}
      dataSource={list}
      renderItem={(item) => (
        <List.Item>
          <Card hoverable cover={<img alt={item.title} src={item.cover} />}>
            <Card.Meta
              title={<a href={item.href}>{item.title}</a>}
              description={
                <Paragraph
                  ellipsis={{
                    rows: 2,
                  }}
                >
                  {item.subDescription}
                </Paragraph>
              }
            />
            <div
              style={{
                display: "flex",
                height: 20,
                marginTop: 16,
                marginBottom: -4,
                lineHeight: "20px",
              }}
            >
              <span style={{ flex: 1, color: "rgba(0, 0, 0, 0.45)", fontSize: 12 }}>
                {dayjs(item.updatedAt).fromNow()}
              </span>
              <div style={{ flex: "0 1 auto" }}>
                <AvatarList size="small">
                  {item.members.map((member, i) => (
                    <AvatarList.Item
                      key={getKey(item.id, i)}
                      src={member.avatar}
                      tips={member.name}
                    />
                  ))}
                </AvatarList>
              </div>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
  return (
    <div>
      <Card variant="borderless">
        <Form
          layout="inline"
          onValuesChange={(_, values) => {
            run(values);
          }}
        >
          <StandardFormRow
            title="Category"
            block
            style={{
              paddingBottom: 11,
            }}
          >
            <FormItem name="category">
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
            </FormItem>
          </StandardFormRow>
          <StandardFormRow title="Other Options" grid last>
            <Row gutter={16}>
              <Col lg={8} md={10} sm={10} xs={24}>
                <FormItem {...formItemLayout} label="Author" name="author">
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
                </FormItem>
              </Col>
              <Col lg={8} md={10} sm={10} xs={24}>
                <FormItem {...formItemLayout} label="Rating" name="rate">
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
                </FormItem>
              </Col>
            </Row>
          </StandardFormRow>
        </Form>
      </Card>
      <div style={{ marginTop: 24 }}>{cardList}</div>
    </div>
  );
};
export default Projects;
