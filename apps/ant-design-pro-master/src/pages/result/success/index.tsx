import { DingdingOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-components';
import { Button, Card, Descriptions, Result, Steps } from 'antd';
import React from 'react';
import useStyles from './index.style';

const descriptionItems = [
  { key: 'id', label: 'Project ID', children: '23421' },
  { key: 'owner', label: 'Owner', children: 'Lily Qu' },
  { key: 'time', label: 'Effective Time', children: '2016-12-12 ~ 2017-12-12' },
];

const extra = (
  <>
    <Button type="primary">Back to List</Button>
    <Button>View Project</Button>
    <Button>Print</Button>
  </>
);

const Success: React.FC = () => {
  const { styles } = useStyles();
  const desc1 = (
    <div className={styles.title}>
      <div
        style={{
          margin: '8px 0 4px',
        }}
      >
        <span>Lily Qu</span>
        <DingdingOutlined
          style={{
            marginLeft: 8,
            color: '#00A0E9',
          }}
        />
      </div>
      <div>2016-12-12 12:32</div>
    </div>
  );
  const desc2 = (
    <div
      style={{
        fontSize: 12,
      }}
      className={styles.title}
    >
      <div
        style={{
          margin: '8px 0 4px',
        }}
      >
        <span>Mao Zhou</span>
        <Button type="link" style={{ padding: 0 }}>
          <DingdingOutlined
            style={{
              color: '#00A0E9',
              marginLeft: 8,
            }}
          />
          <span>Send a reminder</span>
        </Button>
      </div>
    </div>
  );
  const content = (
    <>
      <Descriptions title="Project Name" items={descriptionItems} />
      <br />
      <Steps
        type="dot"
        current={1}
        items={[
          {
            title: (
              <span
                style={{
                  fontSize: 14,
                }}
              >
                Create Project
              </span>
            ),
            content: desc1,
          },
          {
            title: (
              <span
                style={{
                  fontSize: 14,
                }}
              >
                Department Initial Review
              </span>
            ),
            content: desc2,
          },
          {
            title: (
              <span
                style={{
                  fontSize: 14,
                }}
              >
                Finance Review
              </span>
            ),
          },
          {
            title: (
              <span
                style={{
                  fontSize: 14,
                }}
              >
                Done
              </span>
            ),
          },
        ]}
      />
    </>
  );
  return (
    <GridContent>
      <Card variant="borderless">
        <Result
          status="success"
          title="Submission Successful"
          subTitle="The submission result page is used to give feedback on the outcome of a series of operational tasks. For simple operations, using a global Message notification is enough. This text area can show a brief supplementary explanation, and if there is a need to display something like a 'document', the gray area below can present more complex content."
          extra={extra}
          style={{
            marginBottom: 16,
          }}
        >
          {content}
        </Result>
      </Card>
    </GridContent>
  );
};

export default Success;
