import {
  App,
  Button,
  Col,
  Form,
  Input,
  Popover,
  Progress,
  Row,
  Select,
  Space,
  theme,
} from "antd";
import type { Store } from "antd/es/form/interface";
import { useEffect, useState, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fakeRegister } from "./service";

const FormItem = Form.Item;
const { Option } = Select;

const passwordProgressMap: {
  ok: "success";
  pass: "normal";
  poor: "exception";
} = {
  ok: "success",
  pass: "normal",
  poor: "exception",
};

const getPasswordStatus = (value?: string) => {
  if (value && value.length > 9) return "ok";
  if (value && value.length > 5) return "pass";
  return "poor";
};

const PasswordProgress: FC<{ value?: string }> = ({ value }) => {
  const passwordStatus = getPasswordStatus(value);
  return value?.length ? (
    <div style={{ marginTop: 10 }}>
      <Progress
        status={passwordProgressMap[passwordStatus]}
        size={6}
        percent={value.length * 10 > 100 ? 100 : value.length * 10}
        showInfo={false}
      />
    </div>
  ) : null;
};

const Register: FC = () => {
  const { token } = theme.useToken();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [count, setCount] = useState(0);
  const [open, setVisible] = useState(false);
  const [prefix, setPrefix] = useState("86");
  const [popover, setPopover] = useState(false);
  const confirmDirty = false;

  const passwordStatusMap = {
    ok: <div style={{ color: token.colorSuccess }}>Strength: Strong</div>,
    pass: <div style={{ color: token.colorWarning }}>Strength: Medium</div>,
    poor: <div style={{ color: token.colorError }}>Strength: Too Short</div>,
  };

  const [form] = Form.useForm();

  useEffect(() => {
    document.title = "Register - Ant Design Pro";
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (count > 0) {
      interval = window.setInterval(() => {
        setCount((c) => {
          if (c <= 1) {
            clearInterval(interval);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [count > 0]);

  const onGetCaptcha = () => {
    setCount(59);
  };

  const onFinish = async (values: Store) => {
    setSubmitting(true);
    try {
      const payload = {
        mail: values.email,
        password: values.password,
        confirm: values.confirm,
        mobile: values.mobile,
        captcha: values.captcha,
        prefix: values.prefix,
      };
      const data = await fakeRegister(payload);
      if (data.status === "ok") {
        message.success("Registration successful!");
        navigate(`/user/register-result?account=${values.email}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const checkConfirm = (_: unknown, value: string) => {
    if (value && value !== form.getFieldValue("password")) {
      return Promise.reject(new Error("The two passwords do not match!"));
    }
    return Promise.resolve();
  };

  const checkPassword = (_: unknown, value: string) => {
    if (!value) {
      setVisible(false);
      return Promise.reject(new Error("Please enter a password!"));
    }
    if (!open) setVisible(true);
    setPopover(!popover);
    if (value.length < 6) {
      return Promise.reject(new Error(""));
    }
    if (value && confirmDirty) {
      form.validateFields(["confirm"]);
    }
    return Promise.resolve();
  };

  const password = Form.useWatch("password", form);
  const passwordStatus = getPasswordStatus(password);

  return (
    <div style={{ width: 368, margin: "0 auto" }}>
      <h3 style={{ marginBottom: 20, fontSize: 16 }}>Register</h3>
      <Form form={form} name="UserRegister" onFinish={onFinish}>
        <FormItem
          name="email"
          rules={[
            { required: true, message: "Please enter an email address!" },
            { type: "email", message: "Invalid email address format!" },
          ]}
        >
          <Input size="large" placeholder="Email" />
        </FormItem>
        <Popover
          content={
            open && (
              <div style={{ padding: "4px 0" }}>
                {passwordStatusMap[passwordStatus]}
                <PasswordProgress value={password} />
                <div style={{ marginTop: 10 }}>
                  Please enter at least 6 characters. Please don&apos;t use an
                  easily guessed password.
                </div>
              </div>
            )
          }
          overlayStyle={{ width: 240 }}
          placement="right"
          open={open}
        >
          <FormItem
            name="password"
            style={{ marginBottom: 24 }}
            rules={[{ validator: checkPassword }]}
          >
            <Input
              size="large"
              type="password"
              placeholder="At least 6 characters, case-sensitive"
            />
          </FormItem>
        </Popover>
        <FormItem
          name="confirm"
          rules={[
            { required: true, message: "Please confirm your password" },
            { validator: checkConfirm },
          ]}
        >
          <Input size="large" type="password" placeholder="Confirm password" />
        </FormItem>
        <FormItem
          name="mobile"
          rules={[
            { required: true, message: "Please enter a phone number!" },
            { pattern: /^\d{11}$/, message: "Invalid phone number format!" },
          ]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Select
              size="large"
              value={prefix}
              onChange={setPrefix}
              style={{ width: "30%" }}
            >
              <Option value="86">+86</Option>
              <Option value="87">+87</Option>
            </Select>
            <Input size="large" placeholder="Phone number" />
          </Space.Compact>
        </FormItem>
        <Row gutter={8}>
          <Col span={16}>
            <FormItem
              name="captcha"
              rules={[
                { required: true, message: "Please enter the verification code!" },
              ]}
            >
              <Input size="large" placeholder="Verification code" />
            </FormItem>
          </Col>
          <Col span={8}>
            <Button size="large" disabled={!!count} block onClick={onGetCaptcha}>
              {count ? `${count} s` : "Get verification code"}
            </Button>
          </Col>
        </Row>
        <FormItem>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              size="large"
              loading={submitting}
              style={{ width: "50%" }}
              type="primary"
              htmlType="submit"
            >
              Register
            </Button>
            <Link to="/user/login">Log in with an existing account</Link>
          </div>
        </FormItem>
      </Form>
    </div>
  );
};

export default Register;
