import { Button, Result } from "antd";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function RegisterResult() {
  const [params] = useSearchParams();

  useEffect(() => {
    document.title = "Register Result - Ant Design Pro";
  }, []);

  const actions = (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      <Button size="large" type="primary">
        Check Email
      </Button>
      <Link to="/">
        <Button size="large">Back to Home</Button>
      </Link>
    </div>
  );

  const email = params?.get("account") || "AntDesign@example.com";
  return (
    <Result
      status="success"
      title={`Your account: ${email} was registered successfully`}
      subTitle="An activation email has been sent to your inbox and is valid for 24 hours. Please log in to your email promptly and click the link to activate your account."
      extra={actions}
    />
  );
}
