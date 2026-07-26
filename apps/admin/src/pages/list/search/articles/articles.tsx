/**
 * Ported from ant-design-pro-master/src/pages/list/search/articles/index.tsx.
 * Original used `@tanstack/react-query`'s useQuery (with isFetching for the
 * "Load More" spinner); admin doesn't have that dependency, so this uses
 * plain useState + a manual `load()` call, with a separate `isFetching`
 * flag toggled around each call. Original also used `createStyles`
 * (antd-style) for two trivial rules — inlined here. `@/components` becomes
 * the local `../components/*` (ArticleListContent, StandardFormRow,
 * TagSelect), and `../../mock` (categoryOptions) becomes `../../mock`.
 */
import {
  LikeOutlined,
  LoadingOutlined,
  MessageOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Flex, Form, List, Row, Select, Tag } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import type { FC } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ArticleListContent from "../components/ArticleListContent";
import StandardFormRow from "../components/StandardFormRow";
import TagSelect from "../components/TagSelect";
import { categoryOptions } from "../../mock";
import type { ListItemDataType } from "./data";
import { queryFakeList } from "./mockData";

const FormItem = Form.Item;

const pageSize = 5;
const owners = [
  {
    id: "wzj",
    name: "Myself",
  },
  {
    id: "wjh",
    name: "Jiahao Wu",
  },
  {
    id: "zxx",
    name: "David Zhou",
  },
  {
    id: "zly",
    name: "Liying Zhao",
  },
  {
    id: "ym",
    name: "Yao Ming",
  },
];
const formItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 12 },
  },
};

const IconText: React.FC<{
  type: string;
  text: React.ReactNode;
}> = ({ type, text }) => {
  switch (type) {
    case "star-o":
      return (
        <span>
          <StarOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      );
    case "like-o":
      return (
        <span>
          <LikeOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      );
    case "message":
      return (
        <span>
          <MessageOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      );
    default:
      return null;
  }
};

const Articles: FC = () => {
  const [form] = Form.useForm();
  const filtersRef = useRef<{
    category?: (string | number)[];
    owner?: string[];
  }>({});

  const [list, setList] = useState<ListItemDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    document.title = "Search List (Articles) - Ant Design Pro";
  }, []);

  const load = async () => {
    setIsFetching(true);
    try {
      const res = await queryFakeList({
        count: pageSize,
        ...filtersRef.current,
      });
      setList(res.data.list);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = () => {
    load();
  };
  const loadingMore = isFetching;
  const reload = () => {
    filtersRef.current = form.getFieldsValue();
    load();
  };

  const listItemExtra = <div style={{ width: 272, height: 1 }} />;

  const setOwner = () => {
    const owner = ["wzj"];
    form.setFieldsValue({
      owner,
    });
    filtersRef.current = {
      ...filtersRef.current,
      owner,
    };
    load();
  };

  const loadMoreDom = list.length > 0 && (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <Button onClick={loadMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
        {loadingMore ? (
          <span>
            <LoadingOutlined /> Loading...
          </span>
        ) : (
          "Load More"
        )}
      </Button>
    </div>
  );

  const ownerOptions = useMemo<DefaultOptionType[]>(
    () =>
      owners.map((item) => ({
        label: item.name,
        value: item.id,
      })),
    [],
  );

  return (
    <>
      <Card variant="borderless">
        <Form
          layout="inline"
          form={form}
          initialValues={{
            owner: ["wjh", "zxx"],
          }}
          onValuesChange={reload}
        >
          <StandardFormRow title="Category" block style={{ paddingBottom: 11 }}>
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
          <StandardFormRow title="owner" grid>
            <FormItem name="owner" noStyle>
              <Select
                mode="multiple"
                placeholder="Select owner"
                style={{ minWidth: "6rem" }}
                options={ownerOptions}
              />
            </FormItem>
            <Button
              type="link"
              style={{ marginLeft: 12 }}
              onClick={setOwner}
            >
              Only show mine
            </Button>
          </StandardFormRow>
          <StandardFormRow title="Other Options" grid last>
            <Row gutter={16}>
              <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                <FormItem {...formItemLayout} label="Active Users" name="user">
                  <Select
                    placeholder="No limit"
                    style={{ maxWidth: 200, width: "100%" }}
                    options={[
                      {
                        label: "Li San",
                        value: "lisa",
                      },
                    ]}
                  />
                </FormItem>
              </Col>
              <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                <FormItem {...formItemLayout} label="Rating" name="rate">
                  <Select
                    placeholder="No limit"
                    style={{ maxWidth: 200, width: "100%" }}
                    options={[
                      {
                        label: "Excellent",
                        value: "good",
                      },
                    ]}
                  />
                </FormItem>
              </Col>
            </Row>
          </StandardFormRow>
        </Form>
      </Card>
      <Card
        style={{ marginTop: 24 }}
        variant="borderless"
        styles={{
          body: {
            padding: "8px 32px 32px 32px",
          },
        }}
      >
        <List<ListItemDataType>
          size="large"
          loading={loading}
          rowKey="id"
          itemLayout="vertical"
          dataSource={list}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <IconText key="star" type="star-o" text={item.star} />,
                <IconText key="like" type="like-o" text={item.like} />,
                <IconText key="message" type="message" text={item.message} />,
              ]}
              extra={listItemExtra}
            >
              <List.Item.Meta
                title={
                  <a style={{ color: "rgba(0, 0, 0, 0.88)" }} href={item.href}>
                    {item.title}
                  </a>
                }
                description={
                  <Flex wrap gap="small">
                    <Tag>Ant Design</Tag>
                    <Tag>Design Language</Tag>
                    <Tag>Ant Group</Tag>
                  </Flex>
                }
              />
              <ArticleListContent data={item} />
            </List.Item>
          )}
        />
        {loadMoreDom}
      </Card>
    </>
  );
};

export default Articles;
