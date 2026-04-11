import { Navigate, Route, Routes } from "react-router-dom";
import { WorkspaceLayout } from "./components/WorkspaceLayout";
import { RequireAuth } from "./components/RequireAuth";
import { LoginPage } from "./pages/LoginPage";
import { EnterpriseFilingPage, EnterpriseHomePage, EnterpriseReportPage } from "./pages/EnterprisePages";
import { CityHomePage, CityReviewPage } from "./pages/CityPages";
import { ProvinceAnalysisPage, ProvinceHomePage, ProvinceSummaryPage } from "./pages/ProvincePages";
import { ExchangePage, NotFoundPage, NoticeCenterPage, SystemSettingsPage } from "./pages/SharedPages";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/app/:role"
        element={
          <RequireAuth>
            <WorkspaceLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<WorkspaceHomeRouter />} />
        <Route path="filing/*" element={<EnterpriseFilingPage />} />
        <Route path="reports/*" element={<EnterpriseReportPage />} />
        <Route path="review/*" element={<CityReviewPage />} />
        <Route path="summary/*" element={<ProvinceSummaryPage />} />
        <Route path="analysis/*" element={<ProvinceAnalysisPage />} />
        <Route path="notices" element={<NoticeCenterPage />} />
        <Route path="exchange" element={<ExchangePage />} />
        <Route path="settings" element={<SystemSettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function WorkspaceHomeRouter() {
  return (
    <Routes>
      <Route path="*" element={<WorkspaceHomeByRole />} />
    </Routes>
  );
}

function WorkspaceHomeByRole() {
  const role = window.location.pathname.split("/")[2];

  if (role === "city") {
    return <CityHomePage />;
  }

  if (role === "province") {
    return <ProvinceHomePage />;
  }

  return <EnterpriseHomePage />;
}
