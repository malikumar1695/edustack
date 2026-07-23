import { useQuery } from '@tanstack/react-query';
import { Card, Col, Form, List, Row, Select, Typography } from 'antd';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { useState } from 'react';
import { AvatarList, StandardFormRow, TagSelect } from '@/components';
import { categoryOptions } from '../../mock';
import type { ListItemDataType } from './data';
import { queryFakeList } from './service';
import useStyles from './style.style';

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
  const { styles } = useStyles();
  const [filters, setFilters] = useState<{
    category?: (string | number)[];
    author?: string;
  }>({});
  const { data, isLoading: loading } = useQuery({
    queryKey: ['search-projects', filters],
    queryFn: () =>
      queryFakeList({ count: 8, ...filters }).then((res) => res.data),
  });

  const run = (values: any) => {
    setFilters(values);
  };
  const list = data?.list || [];
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
          <Card
            className={styles.card}
            hoverable
            cover={<img alt={item.title} src={item.cover} />}
          >
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
            <div className={styles.cardItemContent}>
              <span>{dayjs(item.updatedAt).fromNow()}</span>
              <div className={styles.avatarList}>
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
    <div className={styles.coverCardList}>
      <Card variant="borderless">
        <Form
          layout="inline"
          onValuesChange={(_, values) => {
            // Fetch data when form values change
            // Simulates the query form taking effect
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
                      width: '100%',
                    }}
                    options={[
                      {
                        label: 'Wang Zhaojun',
                        value: 'lisa',
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
                      width: '100%',
                    }}
                    options={[
                      {
                        label: 'Excellent',
                        value: 'good',
                      },
                      {
                        label: 'Average',
                        value: 'normal',
                      },
                    ]}
                  />
                </FormItem>
              </Col>
            </Row>
          </StandardFormRow>
        </Form>
      </Card>
      <div className={styles.cardList}>{cardList}</div>
    </div>
  );
};
export default Projects;
