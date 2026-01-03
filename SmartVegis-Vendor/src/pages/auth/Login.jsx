import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [fssaiNumber, setFssaiNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!fssaiNumber || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.login(fssaiNumber, password);

            if (response.data.success) {
                login(response.data.token, response.data.vendor);

                // Navigate based on location setup status
                if (response.data.vendor.isLocationSet) {
                    navigate('/');
                } else {
                    navigate('/location-setup');
                }
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-logo">
                <div className="auth-logo-icon">🥬</div>
                <div className="auth-logo-text">SmartVegis</div>
                <div className="auth-logo-subtext">Vendor Portal</div>
            </div>

            <div className="auth-card">
                <h2 className="auth-title">Welcome Back</h2>

                {error && (
                    <div className="verification-status error">
                        <span>❌</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">FSSAI License Number</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter your 14-digit FSSAI number"
                            value={fssaiNumber}
                            onChange={(e) => setFssaiNumber(e.target.value.replace(/\D/g, '').slice(0, 14))}
                            maxLength={14}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full btn-lg"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner"></div>
                                Logging in...
                            </>
                        ) : (
                            <>Login</>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/signup">Register</Link>
                </div>
            </div>
        </div>
    );
}
