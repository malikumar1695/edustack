// Mirrors ant-design-pro-master/config/routes.ts, minus the `component`
// field — this only drives ProLayout's sidebar menu. Actual page rendering
// is wired separately in AppRoutes.tsx via React Router.
export type MenuRoute = {
  path: string;
  name?: string;
  icon?: string;
  access?: string;
  routes?: MenuRoute[];
};

export const menuRoutes: MenuRoute[] = [
  {
    path: "/welcome",
    name: "Welcome",
    icon: "home",
  },
  {
    path: "/admin",
    name: "Admin",
    icon: "crown",
    access: "canAdmin",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "dashboard",
    routes: [
      { path: "/dashboard/analysis", name: "Analysis", icon: "barChart" },
      { path: "/dashboard/monitor", name: "Monitor", icon: "monitor" },
      { path: "/dashboard/workplace", name: "Workplace", icon: "desktop" },
    ],
  },
  {
    path: "/form",
    name: "Form",
    icon: "form",
    routes: [
      { path: "/form/basic-form", name: "Basic Form", icon: "form" },
      { path: "/form/step-form", name: "Step Form", icon: "orderedList" },
      { path: "/form/advanced-form", name: "Advanced Form", icon: "profile" },
    ],
  },
  {
    path: "/list",
    name: "List",
    icon: "table",
    routes: [
      {
        path: "/list/search",
        name: "Search List",
        routes: [
          { path: "/list/search/articles", name: "Articles", icon: "read" },
          { path: "/list/search/projects", name: "Projects", icon: "project" },
          {
            path: "/list/search/applications",
            name: "Applications",
            icon: "appstore",
          },
        ],
      },
      { path: "/list/table-list", name: "Table List", icon: "table" },
      { path: "/list/basic-list", name: "Basic List", icon: "unorderedList" },
      { path: "/list/card-list", name: "Card List", icon: "creditCard" },
    ],
  },
  {
    path: "/profile",
    name: "Profile",
    icon: "profile",
    routes: [
      { path: "/profile/basic", name: "Basic", icon: "idcard" },
      { path: "/profile/advanced", name: "Advanced", icon: "crown" },
    ],
  },
  {
    path: "/result",
    name: "Result",
    icon: "checkCircle",
    routes: [
      { path: "/result/success", name: "Success", icon: "checkCircle" },
      { path: "/result/fail", name: "Fail", icon: "closeCircle" },
    ],
  },
  {
    path: "/exception",
    name: "Exception",
    icon: "warning",
    routes: [
      { path: "/exception/403", name: "403", icon: "stop" },
      { path: "/exception/404", name: "404", icon: "warning" },
      { path: "/exception/500", name: "500", icon: "bug" },
    ],
  },
  {
    path: "/account",
    name: "Account",
    icon: "user",
    routes: [
      { path: "/account/users", name: "Users", icon: "user" },
      { path: "/account/center", name: "Center", icon: "user" },
      { path: "/account/settings", name: "Settings", icon: "setting" },
    ],
  },
  {
    path: "/chatbot",
    name: "Chatbot",
    icon: "robot",
  },
];
