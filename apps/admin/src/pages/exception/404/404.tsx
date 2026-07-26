import { Button, Card, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const Exception404: React.FC = () => {
  return (
    <Card variant="borderless">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link to="/">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    </Card>
  );
};

export default Exception404;
