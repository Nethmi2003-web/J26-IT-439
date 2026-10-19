import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import MainDashboard from './pages/MainDashboard.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';
import C1Overview from './pages/c1/C1Overview.jsx';
import C1Dashboard from './pages/c1/C1Dashboard.jsx';
import C1ProductDetail from './pages/c1/C1ProductDetail.jsx';
import C1ModelComparison from './pages/c1/C1ModelComparison.jsx';
import C1Alerts from './pages/c1/C1Alerts.jsx';
import C1Reports from './pages/c1/C1Reports.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<MainDashboard />} />

        {/* C1 – Multi-Product Export Forecasting */}
        <Route path="/c1" element={<C1Overview />} />
        <Route path="/c1/dashboard" element={<C1Dashboard />} />
        <Route path="/c1/product/:productId" element={<C1ProductDetail />} />
        <Route path="/c1/models" element={<C1ModelComparison />} />
        <Route path="/c1/alerts" element={<C1Alerts />} />
        <Route path="/c1/reports" element={<C1Reports />} />

        {/* Shared pages not built yet */}
        <Route
          path="/profile"
          element={<PlaceholderPage title="Profile" description="User profile management will be added with authentication." />}
        />
        <Route
          path="/settings"
          element={<PlaceholderPage title="Settings" description="Alert thresholds and account settings will be configurable here." />}
        />
        <Route
          path="/about"
          element={
            <PlaceholderPage
              title="About"
              description="CoconutRisk AI is a research project on AI-driven risk assessment for the Sri Lankan coconut industry, covering export forecasting, crown health, drought risk and disease spread."
            />
          }
        />
        <Route path="*" element={<PlaceholderPage title="Page not found" description="The page you are looking for does not exist." />} />
      </Route>
    </Routes>
  );
}
