import { Navigate, Route, Routes } from "react-router-dom";
import NotYetPorted from "../components/NotYetPorted";
import AppLayout from "../layouts/AppLayout";
import Admin from "../pages/Admin/Admin";
import AccountCenter from "../pages/account/center/center";
import AccountSettings from "../pages/account/settings/settings";
import DashboardAnalysis from "../pages/dashboard/analysis/analysis";
import DashboardMonitor from "../pages/dashboard/monitor/monitor";
import DashboardWorkplace from "../pages/dashboard/workplace/workplace";
import Exception403 from "../pages/exception/403/403";
import Exception404 from "../pages/exception/404/404";
import Exception500 from "../pages/exception/500/500";
import AdvancedForm from "../pages/form/advanced-form/advanced-form";
import BasicForm from "../pages/form/basic-form/basic-form";
import StepForm from "../pages/form/step-form/step-form";
import BasicList from "../pages/list/basic-list/basic-list";
import CardList from "../pages/list/card-list/card-list";
import SearchList from "../pages/list/search/search";
import SearchApplications from "../pages/list/search/applications/applications";
import SearchArticles from "../pages/list/search/articles/articles";
import SearchProjects from "../pages/list/search/projects/projects";
import ProfileAdvanced from "../pages/profile/advanced/advanced";
import ProfileBasic from "../pages/profile/basic/basic";
import ResultFail from "../pages/result/fail/fail";
import ResultSuccess from "../pages/result/success/success";
import TableList from "../pages/table-list/table-list";
import Welcome from "../pages/Welcome";
import Login from "../pages/user/login/login";
import Register from "../pages/user/register/register";
import RegisterResult from "../pages/user/register-result/register-result";
import Users from "../pages/account/users/users";

// Every path below mirrors ant-design-pro-master/config/routes.ts. Routes
// without a real page yet render <NotYetPorted /> so navigation and the
// auth guard are fully testable while pages get ported incrementally —
// see NOTES.md for the running checklist.
export default function AppRoutes() {
  return (
    <Routes>
      {/* config/routes.ts: path: '/user', layout: false */}
      <Route path="/user/login" element={<Login />} />
      <Route path="/user/register" element={<Register />} />
      <Route path="/user/register-result" element={<RegisterResult />} />

      {/* Everything else sits behind the ProLayout shell + auth guard */}
      <Route element={<AppLayout />}>
        <Route path="/welcome" element={<Welcome />} />

        <Route path="/admin/sub-page" element={<Admin />} />
        <Route path="/account/users" element={<Users />} />
        <Route path="/admin" element={<Navigate to="/admin/sub-page" replace />} />

        <Route path="/dashboard/analysis" element={<DashboardAnalysis />} />
        <Route path="/dashboard/monitor" element={<DashboardMonitor />} />
        <Route path="/dashboard/workplace" element={<DashboardWorkplace />} />
        <Route
          path="/dashboard"
          element={<Navigate to="/dashboard/analysis" replace />}
        />

        <Route path="/form/basic-form" element={<BasicForm />} />
        <Route path="/form/step-form" element={<StepForm />} />
        <Route path="/form/advanced-form" element={<AdvancedForm />} />
        <Route path="/form" element={<Navigate to="/form/basic-form" replace />} />

        <Route path="/list/search" element={<SearchList />}>
          <Route index element={<Navigate to="articles" replace />} />
          <Route path="articles" element={<SearchArticles />} />
          <Route path="projects" element={<SearchProjects />} />
          <Route path="applications" element={<SearchApplications />} />
        </Route>
        <Route path="/list/table-list" element={<TableList />} />
        <Route path="/list/basic-list" element={<BasicList />} />
        <Route path="/list/card-list" element={<CardList />} />
        <Route path="/list" element={<Navigate to="/list/table-list" replace />} />

        <Route path="/profile/basic" element={<ProfileBasic />} />
        <Route path="/profile/advanced" element={<ProfileAdvanced />} />
        <Route
          path="/profile"
          element={<Navigate to="/profile/basic" replace />}
        />

        <Route path="/result/success" element={<ResultSuccess />} />
        <Route path="/result/fail" element={<ResultFail />} />
        <Route
          path="/result"
          element={<Navigate to="/result/success" replace />}
        />

        <Route path="/exception/403" element={<Exception403 />} />
        <Route path="/exception/404" element={<Exception404 />} />
        <Route path="/exception/500" element={<Exception500 />} />
        <Route
          path="/exception"
          element={<Navigate to="/exception/403" replace />}
        />

        <Route path="/account/center" element={<AccountCenter />} />
        <Route path="/account/settings" element={<AccountSettings />} />
        <Route
          path="/account"
          element={<Navigate to="/account/center" replace />}
        />

        <Route path="/chatbot" element={<NotYetPorted pageName="Chatbot" />} />

        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="*" element={<Exception404 />} />
      </Route>
    </Routes>
  );
}
