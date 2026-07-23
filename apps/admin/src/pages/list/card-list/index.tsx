/**
 * Ported from ant-design-pro-master/src/pages/list/card-list/index.tsx.
 * Original used `@tanstack/react-query`'s useQuery; admin doesn't have
 * that dependency, so this is plain useState + useEffect. Original also
 * used `createStyles` (antd-style) for card/grid styling — inlined here.
 * The `.ant-card-body:hover` title-color-on-hover rule and the
 * `@media screen and (max-width: ...)` breakpoint that hides `extraImg`
 * on small screens are dropped — inline styles can't express hover or
 * media queries, and both are decorative rather than functional.
 */
import { PlusOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { Button, Card, List, Typography } from "antd";
import { useEffect, useState } from "react";
import type { CardListItemDataType } from "./data";
import { queryFakeList } from "./mockData";

const { Paragraph } = Typography;
const nullData: Partial<CardListItemDataType> = {};

const CardList = () => {
  const [data, setData] = useState<{ list: CardListItemDataType[] }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Card List - Ant Design Pro";
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    queryFakeList({ count: 8 }).then((res) => {
      if (!cancelled) {
        setData(res.data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const list = data?.list || [];
  const content = (
    <div style={{ position: "relative" }}>
      <p>
        Sample paragraph: the Ant Group design platform, ant.design, lets you
        integrate seamlessly with the Ant Group ecosystem with minimal
        effort, providing an experience solution spanning design and
        development.
      </p>
      <div style={{ display: "flex", flexWrap: "nowrap", marginTop: 16 }}>
        <a href="https://pro.ant.design/docs/getting-started" style={{ display: "inline-flex", alignItems: "center", marginRight: 32, whiteSpace: "nowrap" }}>
          <img
            alt=""
            src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg"
            style={{ width: 24, marginRight: 8 }}
          />{" "}
          Getting Started
        </a>
        <a href="https://pro.ant.design/docs/introduction" style={{ display: "inline-flex", alignItems: "center", marginRight: 32, whiteSpace: "nowrap" }}>
          <img
            alt=""
            src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg"
            style={{ width: 24, marginRight: 8 }}
          />{" "}
          Introduction
        </a>
        <a href="https://pro.ant.design/docs/overview" style={{ display: "inline-flex", alignItems: "center", marginRight: 32, whiteSpace: "nowrap" }}>
          <img
            alt=""
            src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg"
            style={{ width: 24, marginRight: 8 }}
          />{" "}
          Documentation
        </a>
      </div>
    </div>
  );
  const extraContent = (
    <div style={{ width: 155, marginTop: -20, textAlign: "center" }}>
      <img
        alt="This is a title"
        src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        style={{ width: "100%" }}
      />
    </div>
  );
  return (
    <PageContainer content={content} extraContent={extraContent}>
      <div>
        <List<Partial<CardListItemDataType>>
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
          dataSource={[nullData, ...list]}
          renderItem={(item) => {
            if (item?.id) {
              return (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    actions={[
                      <Button key="option1" type="link">
                        Action One
                      </Button>,
                      <Button key="option2" type="link">
                        Action Two
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      avatar={
                        <img
                          alt=""
                          src={item.avatar}
                          style={{ width: 48, height: 48, borderRadius: 48 }}
                        />
                      }
                      title={<a href={item.href}>{item.title}</a>}
                      description={
                        <Paragraph
                          style={{ height: 64 }}
                          ellipsis={{
                            rows: 3,
                          }}
                        >
                          {item.description}
                        </Paragraph>
                      }
                    />
                  </Card>
                </List.Item>
              );
            }
            return (
              <List.Item>
                <Button
                  type="dashed"
                  style={{
                    width: "100%",
                    height: 201,
                    color: "rgba(0, 0, 0, 0.45)",
                  }}
                >
                  <PlusOutlined /> Add Product
                </Button>
              </List.Item>
            );
          }}
        />
      </div>
    </PageContainer>
  );
};
export default CardList;
