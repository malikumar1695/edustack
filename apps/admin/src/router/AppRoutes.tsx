import { Navigate, Route, Routes } from "react-router-dom";
import NotYetPorted from "../components/NotYetPorted";
import AppLayout from "../layouts/AppLayout";
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
        <Route path="/welcome" element={<NotYetPorted pageName="Welcome" />} />

        <Route
          path="/admin/sub-page"
          element={<NotYetPorted pageName="Admin Sub-page" />}
        />
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

        <Route
          path="/form/basic-form"
          element={<NotYetPorted pageName="Form / Basic Form" />}
        />
        <Route
          path="/form/step-form"
          element={<NotYetPorted pageName="Form / Step Form" />}
        />
        <Route
          path="/form/advanced-form"
          element={<NotYetPorted pageName="Form / Advanced Form" />}
        />
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

        <Route
          path="/result/success"
          element={<NotYetPorted pageName="Result / Success" />}
        />
        <Route
          path="/result/fail"
          element={<NotYetPorted pageName="Result / Fail" />}
        />
        <Route
          path="/result"
          element={<Navigate to="/result/success" replace />}
        />

        <Route
          path="/exception/403"
          element={<NotYetPorted pageName="Exception / 403" />}
        />
        <Route
          path="/exception/404"
          element={<NotYetPorted pageName="Exception / 404" />}
        />
        <Route
          path="/exception/500"
          element={<NotYetPorted pageName="Exception / 500" />}
        />
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
        <Route path="*" element={<NotYetPorted pageName="404" />} />
      </Route>
    </Routes>
  );
}
