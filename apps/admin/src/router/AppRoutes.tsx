import { Navigate, Route, Routes } from "react-router-dom";
import NotYetPorted from "../components/NotYetPorted";
import AppLayout from "../layouts/AppLayout";
import Admin from "../pages/Admin";
import Exception403 from "../pages/exception/403";
import Exception404 from "../pages/exception/404";
import Exception500 from "../pages/exception/500";
import AdvancedForm from "../pages/form/advanced-form";
import BasicForm from "../pages/form/basic-form";
import StepForm from "../pages/form/step-form";
import ResultFail from "../pages/result/fail";
import ResultSuccess from "../pages/result/success";
import Welcome from "../pages/Welcome";
import Login from "../pages/user/login";

// Every path below mirrors ant-design-pro-master/config/routes.ts. Routes
// without a real page yet render <NotYetPorted /> so navigation and the
// auth guard are fully testable while pages get ported incrementally —
// see NOTES.md for the running checklist.
export default function AppRoutes() {
  return (
    <Routes>
      {/* config/routes.ts: path: '/user', layout: false */}
      <Route path="/user/login" element={<Login />} />
      <Route
        path="/user/register"
        element={<NotYetPorted pageName="Register" />}
      />
      <Route
        path="/user/register-result"
        element={<NotYetPorted pageName="Register Result" />}
      />

      {/* Everything else sits behind the ProLayout shell + auth guard */}
      <Route element={<AppLayout />}>
        <Route path="/welcome" element={<Welcome />} />

        <Route path="/admin/sub-page" element={<Admin />} />
        <Route path="/admin" element={<Navigate to="/admin/sub-page" replace />} />

        <Route
          path="/dashboard/analysis"
          element={<NotYetPorted pageName="Dashboard / Analysis" />}
        />
        <Route
          path="/dashboard/monitor"
          element={<NotYetPorted pageName="Dashboard / Monitor" />}
        />
        <Route
          path="/dashboard/workplace"
          element={<NotYetPorted pageName="Dashboard / Workplace" />}
        />
        <Route
          path="/dashboard"
          element={<Navigate to="/dashboard/analysis" replace />}
        />

        <Route path="/form/basic-form" element={<BasicForm />} />
        <Route path="/form/step-form" element={<StepForm />} />
        <Route path="/form/advanced-form" element={<AdvancedForm />} />
        <Route path="/form" element={<Navigate to="/form/basic-form" replace />} />

        <Route
          path="/list/search/articles"
          element={<NotYetPorted pageName="List / Search / Articles" />}
        />
        <Route
          path="/list/search/projects"
          element={<NotYetPorted pageName="List / Search / Projects" />}
        />
        <Route
          path="/list/search/applications"
          element={<NotYetPorted pageName="List / Search / Applications" />}
        />
        <Route
          path="/list/search"
          element={<Navigate to="/list/search/articles" replace />}
        />
        <Route
          path="/list/table-list"
          element={<NotYetPorted pageName="List / Table List" />}
        />
        <Route
          path="/list/basic-list"
          element={<NotYetPorted pageName="List / Basic List" />}
        />
        <Route
          path="/list/card-list"
          element={<NotYetPorted pageName="List / Card List" />}
        />
        <Route path="/list" element={<Navigate to="/list/table-list" replace />} />

        <Route
          path="/profile/basic"
          element={<NotYetPorted pageName="Profile / Basic" />}
        />
        <Route
          path="/profile/advanced"
          element={<NotYetPorted pageName="Profile / Advanced" />}
        />
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

        <Route
          path="/account/center"
          element={<NotYetPorted pageName="Account / Center" />}
        />
        <Route
          path="/account/settings"
          element={<NotYetPorted pageName="Account / Settings" />}
        />
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
