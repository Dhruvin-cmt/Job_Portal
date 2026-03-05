import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseJobs from './pages/BrowseJobs';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import PublishJob from './pages/PublishJob';
import ApplyJob from './pages/ApplyJob';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="jobs" element={<BrowseJobs />} />
        <Route
          path="employee/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="employee/apply/:jobId"
          element={
            <ProtectedRoute allowedRoles={['Employee']}>
              <ApplyJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="employer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Employer']}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="employer/publish"
          element={
            <ProtectedRoute allowedRoles={['Employer']}>
              <PublishJob />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
