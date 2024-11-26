import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import SuccessPage from './components/SuccessPage';
import ForgotPage1 from './components/ForgotPage1';
import ForgotPage2 from './components/ForgotPage2';
import ForgotSuccess from './components/ForgotSuccess';
import DashboardPage from './components/DashboardPage';
import ProfileSetupPage from './components/ProfileSetupPage';
import ProfileSuccessPage from './components/ProfileSuccessPage';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import UserProfile from './components/UserProfile';
import NotesPage from './components/NotesPage';


// Custom 404 component
const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-4">Page not found</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Go back home
        </button>
      </div>
    </div>
  );
};

const App = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already authenticated (e.g., from localStorage)
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // Auth handlers
  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // Protected Route wrapper component
  const ProtectedRoute = ({ children }) => {
    ProtectedRoute.propTypes = {
      children: PropTypes.node.isRequired,
    };
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Public Route wrapper component (redirects to dashboard if already authenticated)
  const PublicRoute = ({ children }) => {
    PublicRoute.propTypes = {
      children: PropTypes.node.isRequired,
    };
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              </PublicRoute>
            } 
          />
          
          <Route
            path="/signup"
            element={
              <PublicRoute>
                  <SignupPage onSignupSuccess={handleLoginSuccess} />
                </PublicRoute>
            }
          />

          <Route 
            path="/oauth2/redirect" 
            element={
              <OAuth2RedirectHandler 
              />
            }
          />

          {/* Make success page always accessible */}
          <Route 
            path="/success" 
            element={<SuccessPage />} 
          />

          <Route
            path="/forgot1"
            element={
              <PublicRoute>
                <ForgotPage1 />
              </PublicRoute>
            }
          />

          <Route
            path="/forgot2"
            element={
              <PublicRoute>
                <ForgotPage2 />
              </PublicRoute>
            }
          />

          <Route
            path="/forgot-success"
            element={
              <PublicRoute>
                <ForgotSuccess />
              </PublicRoute>
            }
          />

          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute>
                <ProfileSetupPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/setup-success"
            element={
              <ProtectedRoute>
                <ProfileSuccessPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-profile"
            element={
              <ProtectedRoute>
                <UserProfile onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <NotesPage onLogout={handleLogout}/>
              </ProtectedRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardPage onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* Root route */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}  // Always redirect to login
          />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;