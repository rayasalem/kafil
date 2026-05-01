import { Suspense, lazy, FC } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from '@/layouts/MainLayout';
import { User } from '@/types';

// Lazy loading views for production optimization
const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/features/auth/LoginView'));
const Register = lazy(() => import('@/features/auth/RegisterView'));
const AdminDashboard = lazy(() => import('@/features/projects/AdminDashboard'));
const ClientDashboard = lazy(() => import('@/features/projects/ClientDashboard'));
const FreelancerDashboard = lazy(() => import('@/features/projects/FreelancerDashboard'));
const CoordinatorDashboard = lazy(() => import('@/features/projects/CoordinatorDashboard'));
const ArbitratorDashboard = lazy(() => import('@/features/dashboards/ArbitratorDashboard'));
const CreateProject = lazy(() => import('@/features/projects/CreateProjectView'));
const ProjectDetails = lazy(() => import('@/features/projects/ProjectDetailsView'));
const DisputeFlow = lazy(() => import('@/pages/DisputeFlow'));
const ArbitratorCaseView = lazy(() => import('@/pages/ArbitratorCaseView'));
const DisputesPage = lazy(() => import('@/pages/DisputesPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const DashboardRedirect: FC = () => {
  const userStr = localStorage.getItem('user');
  const user: User | null = userStr ? JSON.parse(userStr) : null;
  if (!user || !user.role) return <Navigate to="/login" replace />;
  return <Navigate to={`/dashboard/${user.role}`} replace />;
};

const LoadingFallback: FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

const App: FC = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/client" element={<ClientDashboard />} />
            <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />
            <Route path="/dashboard/coordinator" element={<CoordinatorDashboard />} />
            <Route path="/arbitration" element={<ArbitratorDashboard />} />
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/create" element={<CreateProject />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/dispute/:taskId" element={<DisputeFlow />} />
            <Route path="/arbitrate/:caseId" element={<ArbitratorCaseView />} />
            <Route path="/disputes" element={<DisputesPage />} />
          </Route>
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
