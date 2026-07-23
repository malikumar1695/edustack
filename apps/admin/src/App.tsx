import { App as AntdApp, ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./router/AppRoutes";

export default function App() {
  return (
    <ConfigProvider
      locale={enUS}
      theme={{ token: { colorPrimary: "#1677ff" } }}
    >
      <AntdApp>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
