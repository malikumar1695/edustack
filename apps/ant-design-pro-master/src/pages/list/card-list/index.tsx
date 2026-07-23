import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, List, Typography } from 'antd';
import type { CardListItemDataType } from './data';
import { queryFakeList } from './service';
import useStyles from './style.style';

const { Paragraph } = Typography;
const nullData: Partial<CardListItemDataType> = {};

const CardList = () => {
  const { styles } = useStyles();
  const { data, isLoading: loading } = useQuery({
    queryKey: ['card-list'],
    queryFn: () => queryFakeList({ count: 8 }).then((res) => res.data),
  });
  const list = data?.list || [];
  const content = (
    <div className={styles.pageHeaderContent}>
      <p>
        Sample paragraph: the Ant Group design platform, ant.design, lets you
        integrate seamlessly with the Ant Group ecosystem with minimal
        effort, providing an experience solution spanning design and
        development.
      </p>
      <div className={styles.contentLink}>
        <a href="https://pro.ant.design/docs/getting-started">
          <img
            alt=""
            src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg"
          />{' '}
          Getting Started
        </a>
        <a href="https://pro.ant.design/docs/introduction">
          <img
            alt=""
            src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg"
          />{' '}
          Introduction
        </a>
        <a href="https://pro.ant.design/docs/overview">
          <img
            alt=""
            src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg"
          />{' '}
          Documentation
        </a>
      </div>
    </div>
  );
  const extraContent = (
    <div className={styles.extraImg}>
      <img
        alt="This is a title"
        src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
      />
    </div>
  );
  return (
    <PageContainer content={content} extraContent={extraContent}>
      <div className={styles.cardList}>
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
                    className={styles.card}
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
                          className={styles.cardAvatar}
                          src={item.avatar}
                        />
                      }
                      title={<a href={item.href}>{item.title}</a>}
                      description={
                        <Paragraph
                          className={styles.item}
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
                <Button type="dashed" className={styles.newButton}>
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
