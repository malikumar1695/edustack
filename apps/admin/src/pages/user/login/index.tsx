import {
  AlipayCircleOutlined,
  LockOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from "@ant-design/icons";
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { Alert, App, Button, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/Footer";
import { useAuth, type LoginResult } from "../../../context/AuthContext";

/**
 * Validate redirect URL to prevent open redirect attacks.
 * Only allow same-origin relative paths starting with '/'.
 */
const getSafeRedirectUrl = (redirect: string | null): string => {
  if (!redirect?.startsWith("/")) return "/";
  if (redirect.startsWith("//")) return "/";
  try {
    const parsed = new URL(redirect, window.location.origin);
    if (parsed.origin !== window.location.origin) return "/";
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/";
  }
};

function ActionIcons() {
  const iconStyle = {
    marginLeft: 8,
    color: "rgba(0, 0, 0, 0.2)",
    fontSize: 24,
    verticalAlign: "middle",
    cursor: "pointer",
  };
  return (
    <>
      <AlipayCircleOutlined style={iconStyle} />
      <TaobaoCircleOutlined style={iconStyle} />
      <WeiboCircleOutlined style={iconStyle} />
    </>
  );
}

export default function Login() {
  const [userLoginState, setUserLoginState] = useState<LoginResult>({});
  const { login } = useAuth();
  const { message } = App.useApp();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login Page - Ant Design Pro";
  }, []);

  const handleSubmit = async (values: {
    username?: string;
    password?: string;
  }) => {
    const result = await login(
      values.username ?? "",
      values.password ?? "",
      "account",
    );
    if (result.status === "ok") {
      message.success("Login successful!");
      const urlParams = new URL(window.location.href).searchParams;
      const redirectUrl = getSafeRedirectUrl(urlParams.get("redirect"));
      navigate(redirectUrl, { replace: true });
      return;
    }
    setUserLoginState(result);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "auto",
        backgroundImage:
          "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
        backgroundSize: "100% 100%",
      }}
    >
      <div style={{ flex: 1, padding: "32px 0" }}>
        <LoginForm
          contentStyle={{ minWidth: 280, maxWidth: "75vw" }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Ant Design"
          subTitle="The world's leading enterprise-class UI design language"
          initialValues={{ autoLogin: true }}
          actions={
            <>
              Other login methods
              <ActionIcons />
            </>
          }
          onFinish={handleSubmit}
        >
          <Tabs
            activeKey="account"
            centered
            items={[{ key: "account", label: "Account Password Login" }]}
          />

          {userLoginState.status === "error" && (
            <Alert
              style={{ marginBottom: 24 }}
              message="Incorrect account or password (admin/ant.design)"
              type="error"
              showIcon
            />
          )}

          <ProFormText
            name="username"
            fieldProps={{ size: "large", prefix: <UserOutlined /> }}
            placeholder="Username: admin or user"
            rules={[{ required: true, message: "Please enter a username!" }]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{ size: "large", prefix: <LockOutlined /> }}
            placeholder="Password: ant.design"
            rules={[{ required: true, message: "Please enter a password!" }]}
          />

          <div style={{ marginBottom: 24 }}>
            <ProFormCheckbox noStyle name="autoLogin">
              Auto login
            </ProFormCheckbox>
            <Button type="link" style={{ float: "right", padding: 0 }}>
              Forgot password
            </Button>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
}
