import { CloseCircleOutlined, RightOutlined } from "@ant-design/icons";
import { GridContent } from "@ant-design/pro-components";
import { Button, Card, Result, theme } from "antd";
import type React from "react";

export default () => {
  const { token } = theme.useToken();
  const errorIconStyle: React.CSSProperties = {
    marginRight: 8,
    color: token.colorBgTextActive,
  };
  const titleStyle: React.CSSProperties = {
    marginBottom: 16,
    color: token.colorTextHeading,
    fontWeight: 500,
    fontSize: 16,
  };
  const Content = (
    <>
      <div style={titleStyle}>
        <span>The content you submitted has the following errors:</span>
      </div>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <CloseCircleOutlined style={errorIconStyle} />
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
        <CloseCircleOutlined style={errorIconStyle} />
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
