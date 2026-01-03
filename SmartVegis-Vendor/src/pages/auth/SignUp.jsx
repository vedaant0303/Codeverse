import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';

export default function SignUp() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form data
    const [fssaiNumber, setFssaiNumber] = useState('');
    const [fssaiData, setFssaiData] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Step 1: Verify FSSAI
    const handleVerifyFSSAI = async (e) => {
        e.preventDefault();
        setError('');

        if (fssaiNumber.length !== 14) {
            setError('FSSAI number must be 14 digits');
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.verifyFSSAI(fssaiNumber);

            if (response.data.success && response.data.verified) {
                setFssaiData(response.data.data);
                setStep(2);
            } else {
                setError('FSSAI verification failed. Please check your license number.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Complete Registration
    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (!phoneNumber || !name || !password) {
            setError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.signup({
                fssaiNumber,
                phoneNumber,
                name,
                password,
                fssaiData
            });

            if (response.data.success) {
                login(response.data.token, response.data.vendor);
                navigate('/location-setup');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
                <h2 className="auth-title">
                    {step === 1 ? 'Verify Your FSSAI License' : 'Complete Registration'}
                </h2>

                {error && (
                    <div className="verification-status error">
                        <span>❌</span>
                        <span>{error}</span>
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleVerifyFSSAI}>
                        <div className="form-group">
                            <label className="form-label">FSSAI License Number</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter 14-digit FSSAI number"
                                value={fssaiNumber}
                                onChange={(e) => setFssaiNumber(e.target.value.replace(/\D/g, '').slice(0, 14))}
                                maxLength={14}
                                required
                            />
                            <div className="form-hint">
                                Your 14-digit FSSAI registration number
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full btn-lg"
                            disabled={loading || fssaiNumber.length !== 14}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Verifying...
                                </>
                            ) : (
                                <>Verify License</>
                            )}
                        </button>
                    </form>
                ) : (
                    <>
                        {/* Show verified FSSAI details */}
                        <div className="verification-status success">
                            <span>✅</span>
                            <span>FSSAI License Verified</span>
                        </div>

                        <div className="card mb-lg" style={{ padding: '12px' }}>
                            <div className="text-sm text-muted mb-md">Store Name (from FSSAI)</div>
                            <div className="font-bold">{fssaiData?.companyName}</div>
                            {fssaiData?.address && (
                                <div className="text-sm text-muted mt-md">{fssaiData.address}</div>
                            )}
                        </div>

                        <form onSubmit={handleSignup}>
                            <div className="form-group">
                                <label className="form-label">Your Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="Enter 10-digit phone number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    maxLength={10}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Create a password (min 6 characters)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={6}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                        Creating Account...
                                    </>
                                ) : (
                                    <>Create Account</>
                                )}
                            </button>
                        </form>
                    </>
                )}

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
}
