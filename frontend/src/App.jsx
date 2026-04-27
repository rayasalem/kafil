import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';

// Lazy loading pages for production optimization
const Landing = lazy(() => import('./pages/Landing.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const AdminDashboard = lazy(() => import('./pages/dashboards/AdminDashboard.jsx'));
const ClientDashboard = lazy(() => import('./pages/dashboards/ClientDashboard.jsx'));
const FreelancerDashboard = lazy(() => import('./pages/dashboards/FreelancerDashboard.jsx'));
const CoordinatorDashboard = lazy(() => import('./pages/dashboards/CoordinatorDashboard.jsx'));
const CreateProject = lazy(() => import('./pages/CreateProject.jsx'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails.jsx'));
const DisputeFlow = lazy(() => import('./pages/DisputeFlow.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const DashboardRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.role) return <Navigate to="/login" replace />;
  return <Navigate to={`/dashboard/${user.role}`} replace />;
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

export default function App() {
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
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/create" element={<CreateProject />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/dispute/:taskId" element={<DisputeFlow />} />
          </Route>
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
