import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading, vendor } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="auth-page">
                <div className="flex items-center justify-center">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Redirect to location setup if location not set (except if already on that page)
    if (!vendor?.isLocationSet && location.pathname !== '/location-setup') {
        return <Navigate to="/location-setup" replace />;
    }

    return children;
}
