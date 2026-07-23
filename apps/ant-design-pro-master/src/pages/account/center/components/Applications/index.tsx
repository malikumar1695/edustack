import {
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Card, Dropdown, List, Tooltip } from 'antd';
import React from 'react';
import { formatNumber } from '@/utils/format';
import type { ListItemDataType } from '../../data';
import { queryFakeList } from '../../service';
import useStyles from './index.style';

function formatWan(val: number) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';
  let result: React.ReactNode = val;
  if (val > 10000) {
    result = (
      <span>
        {Math.floor(val / 10000)}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
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

const CardInfo: React.FC<{
  activeUser: React.ReactNode;
  newUser: React.ReactNode;
}> = ({ activeUser, newUser }) => {
  const { styles: stylesApplications } = useStyles();
  return (
    <div className={stylesApplications.cardInfo}>
      <div>
        <p>Active Users</p>
        <p>{activeUser}</p>
      </div>
      <div>
        <p>New Users</p>
        <p>{newUser}</p>
      </div>
    </div>
  );
};

const Applications: React.FC = () => {
  const { styles: stylesApplications } = useStyles();
  // Fetch tab list data
  const { data: listData } = useQuery({
    queryKey: ['applications-list', 30],
    queryFn: () => queryFakeList({ count: 30 }).then((res) => res.data),
  });

  return (
    <List<ListItemDataType>
      rowKey="id"
      className={stylesApplications.filterCardList}
      grid={{
        gutter: 24,
        xxl: 3,
        xl: 2,
        lg: 2,
        md: 2,
        sm: 2,
        xs: 1,
      }}
      dataSource={listData?.list || []}
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
              <Tooltip title="Edit" key="edit">
                <EditOutlined />
              </Tooltip>,
              <Tooltip title="Share" key="share">
                <ShareAltOutlined />
              </Tooltip>,
              <Dropdown
                menu={{
                  items: [
                    {
                      key: '1',
                      title: '1st menu item',
                    },
                    {
                      key: '2',
                      title: '2nd menu item',
                    },
                  ],
                }}
                key="ellipsis"
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
  );
};
export default Applications;
