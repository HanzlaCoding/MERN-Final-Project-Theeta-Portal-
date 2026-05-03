import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import CourseCatalog from './pages/CourseCatalog';
import AdminDashboard from './pages/AdminDashboard';

// A simple Route Guard to protect logged-in specific views
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  // Show nothing while we silently check their token on first load
  if (loading) return null;

  // If they aren't logged in, instantly kick them to /login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // If a specific role is required (like admin), make sure they match
  if (allowedRole && user?.role !== allowedRole) {
    // If not, kick them back to their standard dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, they are allowed. Render the page!
  return children;
};

// Protect the login route so logged-in users get sent away if they visit it manually
const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// We wrap the routing in its own component inside AuthProvider so we can use useContext
function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Set login as the default landing route for this portal */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } />

        <Route path="/register" element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/catalog" element={
          <ProtectedRoute allowedRole="student">
            <CourseCatalog />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    // We wrap exactly everything in the AuthProvider so the whole app knows who is logged in!
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
