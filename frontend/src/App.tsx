import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './app/providers/app-provider';
import { ProtectedRoute, RoleRoute } from './components/guards/RouteGuards';
import { Role } from './enums';

// Layouts
import { AppLayout } from './layouts/AppLayout';

// Auth Pages
import { LoginPage } from './pages/auth/login-page';
import { RegisterPage } from './pages/auth/register-page';
import { RootRedirect } from './pages/RootRedirect';

// Error Pages
import { Forbidden403 } from './pages/errors/Forbidden403';
import { NotFound404 } from './pages/errors/NotFound404';

// Feature Pages (Member)
import { MemberDashboard } from './pages/member/member-dashboard-page';
import { MemberReports } from './pages/member/report-history-page';
import { MemberReportForm } from './pages/member/edit-report-page';

// Feature Pages (Manager)
import { ManagerDashboard } from './pages/manager/manager-dashboard-page';
import { ManagerReports } from './pages/manager/team-reports-page';
import { ManagerReportReview } from './pages/manager/manager-review-page';
import { ManagerProjects } from './pages/manager/project-management-page';

// Feature Pages (Admin)
import { UserManagementPage } from './pages/admin/user-management-page';
import { AIAssistantPage } from './features/ai/pages/ai-assistant-page';

// Feature Pages (Shared)
import { ReportDetail } from './pages/member/report-detail-page';
import { Profile } from './pages/profile/profile-page';

export const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/403" element={<Forbidden403 />} />

            {/* Authenticated Root */}
            <Route path="/" element={<RootRedirect />} />

            {/* Protected Routes Wrapper */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              
              {/* TEAM_MEMBER Routes */}
              <Route element={<RoleRoute allowedRoles={[Role.TEAM_MEMBER]} />}>
                <Route path="/member/dashboard" element={<MemberDashboard />} />
                <Route path="/member/reports" element={<MemberReports />} />
                <Route path="/member/reports/new" element={<MemberReportForm />} />
                <Route path="/member/reports/:id/edit" element={<MemberReportForm />} />
              </Route>

              {/* MANAGER/ADMIN Routes */}
              <Route element={<RoleRoute allowedRoles={[Role.MANAGER, Role.ADMIN]} />}>
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                <Route path="/manager/reports" element={<ManagerReports />} />
                <Route path="/manager/reports/:id/review" element={<ManagerReportReview />} />
                <Route path="/manager/projects" element={<ManagerProjects />} />
                <Route path="/ai" element={<AIAssistantPage />} />
              </Route>

              {/* ADMIN Only Routes */}
              <Route element={<RoleRoute allowedRoles={[Role.ADMIN]} />}>
                <Route path="/admin/users" element={<UserManagementPage />} />
              </Route>

              {/* Shared Protected Routes */}
              <Route path="/reports/:id" element={<ReportDetail />} />
              <Route path="/profile" element={<Profile />} />

            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound404 />} />
          </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
