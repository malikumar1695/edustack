import { LogoutOutlined, SettingOutlined, SkinOutlined } from "@ant-design/icons";
import { ProLayout } from "@ant-design/pro-components";
import { Dropdown, Spin } from "antd";
import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { menuRoutes } from "../router/menuRoutes";
import { withResolvedIcons } from "../router/resolveMenuIcons";

const LOGIN_PATH = "/user/login";

function AvatarDropdown() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return <Spin size="small" />;

  return (
    <Dropdown
      placement="bottomRight"
      arrow
      menu={{
        items: [
          { key: "settings", icon: <SettingOutlined />, label: "Personal Settings" },
          { key: "theme", icon: <SkinOutlined />, label: "Theme Settings" },
          { type: "divider" },
          { key: "logout", icon: <LogoutOutlined />, label: "Log Out" },
        ],
        onClick: ({ key }) => {
          if (key === "logout") {
            logout();
            navigate(LOGIN_PATH);
            return;
          }
          navigate(`/account/${key}`);
        },
      }}
    >
      <span style={{ cursor: "pointer" }}>
        <img
          src={currentUser.avatar}
          alt="avatar"
          style={{ width: 24, height: 24, borderRadius: "50%", marginRight: 8 }}
        />
        {currentUser.name}
      </span>
    </Dropdown>
  );
}

export default function AppLayout() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Ported from app.tsx's `layout.onPageChange` — redirect to login if
  // there's no session, same as Umi Max's runtime layout config did.
  useEffect(() => {
    if (!loading && !currentUser && location.pathname !== LOGIN_PATH) {
      navigate(
        `${LOGIN_PATH}?redirect=${encodeURIComponent(location.pathname + location.search)}`,
        { replace: true },
      );
    }
  }, [loading, currentUser, location, navigate]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ProLayout
      title="Ant Design Pro"
      logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
      layout="mix"
      navTheme="light"
      contentWidth="Fluid"
      fixSiderbar
      colorPrimary="#1677ff"
      location={{ pathname: location.pathname }}
      route={{ path: "/", routes: withResolvedIcons(menuRoutes) }}
      menuItemRender={(item, dom) =>
        item.path ? <Link to={item.path}>{dom}</Link> : dom
      }
      avatarProps={{
        render: () => <AvatarDropdown />,
      }}
      footerRender={() => (
        <div style={{ textAlign: "center", padding: "16px 0", color: "#999" }}>
          Ilm — built on the Ant Design Pro admin shell
        </div>
      )}
    >
      <Outlet />
    </ProLayout>
  );
}
