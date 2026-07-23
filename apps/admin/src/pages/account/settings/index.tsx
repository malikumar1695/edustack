import { GridContent } from "@ant-design/pro-components";
import { Menu } from "antd";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import BaseView from "./components/base";
import BindingView from "./components/binding";
import NotificationView from "./components/notification";
import SecurityView from "./components/security";

type SettingsStateKeys = "base" | "security" | "binding" | "notification";
type SettingsState = {
  mode: "inline" | "horizontal";
  selectKey: SettingsStateKeys;
};

const menuMap: Record<string, React.ReactNode> = {
  base: "Basic Settings",
  security: "Security Settings",
  binding: "Account Binding",
  notification: "New Message Notifications",
};
const menuItems = Object.keys(menuMap).map((item) => ({
  key: item,
  label: menuMap[item],
}));

const SettingsContent: React.FC<{ selectKey: SettingsStateKeys }> = ({
  selectKey,
}) => {
  switch (selectKey) {
    case "base":
      return <BaseView />;
    case "security":
      return <SecurityView />;
    case "binding":
      return <BindingView />;
    case "notification":
      return <NotificationView />;
    default:
      return null;
  }
};

export default function Settings() {
  useEffect(() => {
    document.title = "Personal Settings - Ilm Admin";
  }, []);

  const [initConfig, setInitConfig] = useState<SettingsState>({
    mode: "inline",
    selectKey: "base",
  });
  const dom = useRef<HTMLDivElement | null>(null);

  const resize = () => {
    requestAnimationFrame(() => {
      if (!dom.current) {
        return;
      }
      let mode: "inline" | "horizontal" = "inline";
      const { offsetWidth } = dom.current;
      if (dom.current.offsetWidth < 641 && offsetWidth > 400) {
        mode = "horizontal";
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = "horizontal";
      }
      setInitConfig((prev) => ({
        ...prev,
        mode: mode as SettingsState["mode"],
      }));
    });
  };

  const resizeRef = useRef(resize);
  resizeRef.current = resize;

  useLayoutEffect(() => {
    const handler = () => resizeRef.current();
    window.addEventListener("resize", handler);
    handler();
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  return (
    <GridContent>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          paddingTop: 16,
          paddingBottom: 16,
          backgroundColor: "#fff",
        }}
        ref={(ref) => {
          if (ref) {
            dom.current = ref;
          }
        }}
      >
        <div style={{ width: 224, borderRight: "1px solid #f0f0f0" }}>
          <Menu
            mode={initConfig.mode}
            selectedKeys={[initConfig.selectKey]}
            onClick={({ key }) => {
              setInitConfig((prev) => ({
                ...prev,
                selectKey: key as SettingsStateKeys,
              }));
            }}
            items={menuItems}
          />
        </div>
        <div style={{ flex: 1, padding: "8px 40px" }}>
          <div
            style={{
              marginBottom: 12,
              fontWeight: 500,
              fontSize: 20,
              lineHeight: "28px",
            }}
          >
            {menuMap[initConfig.selectKey]}
          </div>
          <SettingsContent selectKey={initConfig.selectKey} />
        </div>
      </div>
    </GridContent>
  );
}
