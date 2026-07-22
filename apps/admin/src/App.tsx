import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import { Layout, Menu } from "antd";
import DashboardPage from "./pages/Dashboard";

const { Header, Content } = Layout;

function Shell() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div style={{ color: "white", fontWeight: 600, marginRight: 24 }}>
          Ilm Admin
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          items={[{ key: "dashboard", label: <Link to="/">Dashboard</Link> }]}
          style={{ flex: 1 }}
        />
      </Header>
      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shell />}>
          <Route index element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
