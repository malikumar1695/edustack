import { CloseCircleOutlined, RightOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-components';
import { Button, Card, Result } from 'antd';
import useStyles from './index.style';

export default () => {
  const { styles } = useStyles();
  const Content = (
    <>
      <div className={styles.title}>
        <span>The content you submitted has the following errors:</span>
      </div>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <CloseCircleOutlined
          style={{
            marginRight: 8,
          }}
          className={styles.error_icon}
        />
        <span>Your account has been frozen</span>
        <Button
          type="link"
          style={{
            marginLeft: 16,
            padding: 0,
          }}
        >
          <span>Unfreeze now</span>
          <RightOutlined />
        </Button>
      </div>
      <div>
        <CloseCircleOutlined
          style={{
            marginRight: 8,
          }}
          className={styles.error_icon}
        />
        <span>Your account is not yet eligible to apply</span>
        <Button
          type="link"
          style={{
            marginLeft: 16,
            padding: 0,
          }}
        >
          <span>Upgrade now</span>
          <RightOutlined />
        </Button>
      </div>
    </>
  );
  return (
    <GridContent>
      <Card variant="borderless">
        <Result
          status="error"
          title="Submission Failed"
          subTitle="Please check and correct the following information before resubmitting."
          extra={
            <Button type="primary">
              <span>Back to Edit</span>
            </Button>
          }
          style={{
            marginTop: 48,
            marginBottom: 16,
          }}
        >
          {Content}
        </Result>
      </Card>
    </GridContent>
  );
};
