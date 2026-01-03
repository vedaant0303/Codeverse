import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNav from './components/BottomNav';

// Auth Pages
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';

// Main Pages
import Home from './pages/Home';
import Sell from './pages/Sell';
import Settings from './pages/Settings';
import LocationSetup from './pages/LocationSetup';

// Layout wrapper for authenticated pages with bottom nav
function AppLayout({ children }) {
  return (
    <div className="app-container">
      {children}
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Location Setup */}
          <Route
            path="/location-setup"
            element={
              <ProtectedRoute>
                <LocationSetup />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes with Bottom Nav */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Home />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Sell />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
