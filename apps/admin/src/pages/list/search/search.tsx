/**
 * Ported from ant-design-pro-master/src/pages/list/search/index.tsx.
 * Original used `history`/`Outlet`/`useLocation`/`useMatch` from
 * '@umijs/max'; `useLocation`/`useMatch`/`Outlet` are core react-router-dom
 * hooks anyway (Umi just re-exports them), and `history.push` becomes
 * `useNavigate()`. The `useMatch(location.pathname)` round-trip in the
 * original was only ever matching the current location against itself to
 * recover its own pathname, so it's simplified away — `location.pathname`
 * is used directly to compute the base path.
 */
import { PageContainer } from "@ant-design/pro-components";
import { Input } from "antd";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const tabList = [
  {
    key: "articles",
    tab: "Articles",
  },
  {
    key: "projects",
    tab: "Projects",
  },
  {
    key: "applications",
    tab: "Applications",
  },
];

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Search List - Ant Design Pro";
  }, []);

  const handleTabChange = (key: string) => {
    const basePath = location.pathname.substring(
      0,
      location.pathname.lastIndexOf("/"),
    );
    navigate(`${basePath}/${key}`);
  };

  const getTabKey = () => {
    const tabKey = location.pathname.substring(
      location.pathname.lastIndexOf("/") + 1,
    );
    if (tabKey && tabKey !== "search") {
      return tabKey;
    }
    return "articles";
  };

  return (
    <PageContainer
      content={
        <div style={{ textAlign: "center" }}>
          <Input.Search
            placeholder="Please enter"
            enterButton="Search"
            size="large"
            style={{ maxWidth: 522, width: "100%" }}
          />
        </div>
      }
      tabList={tabList}
      tabActiveKey={getTabKey()}
      onTabChange={handleTabChange}
    >
      <Outlet />
    </PageContainer>
  );
}
