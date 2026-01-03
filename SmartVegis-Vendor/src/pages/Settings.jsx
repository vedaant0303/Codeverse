import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { vendorAPI } from '../services/api';

export default function Settings() {
    const navigate = useNavigate();
    const { vendor, logout, updateVendor } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [altStoreName, setAltStoreName] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await vendorAPI.getProfile();
            if (response.data.success) {
                setProfile(response.data.vendor);
                setAltStoreName(response.data.vendor.altStoreName || '');
                setProfilePhoto(response.data.vendor.profilePhoto || '');
            }
        } catch (err) {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const response = await vendorAPI.updateProfile({
                altStoreName,
                profilePhoto
            });

            if (response.data.success) {
                updateVendor({ altStoreName, profilePhoto });
                setSuccess('Profile updated successfully!');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };

    const handleChangeLocation = () => {
        if (confirm('Do you want to update your store location?')) {
            updateVendor({ isLocationSet: false });
            navigate('/location-setup');
        }
    };

    if (loading) {
        return (
            <div className="page">
                <div className="flex flex-col gap-md">
                    <div className="card">
                        <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%' }}></div>
                        <div className="skeleton mt-md" style={{ width: '60%', height: 20 }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <h1 className="mb-lg">⚙️ Settings</h1>

            {error && (
                <div className="verification-status error mb-lg">
                    <span>❌</span>
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="verification-status success mb-lg">
                    <span>✅</span>
                    <span>{success}</span>
                </div>
            )}

            {/* Profile Card */}
            <div className="card mb-lg">
                <div className="flex items-center gap-md mb-lg">
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            background: 'var(--gradient-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            overflow: 'hidden'
                        }}
                    >
                        {profilePhoto ? (
                            <img
                                src={profilePhoto}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            '👤'
                        )}
                    </div>
                    <div>
                        <h3>{profile?.name}</h3>
                        <p className="text-sm text-muted">{profile?.fssaiNumber}</p>
                    </div>
                </div>

                {/* Store Name (Read-only) */}
                <div className="form-group">
                    <label className="form-label">Store Name (from FSSAI)</label>
                    <div
                        className="form-input"
                        style={{
                            background: 'var(--bg-primary)',
                            color: 'var(--text-muted)',
                            cursor: 'not-allowed'
                        }}
                    >
                        🔒 {profile?.storeName}
                    </div>
                    <div className="form-hint">This is fetched from your FSSAI license and cannot be changed</div>
                </div>

                {/* Alt Store Name (Editable) */}
                <div className="form-group">
                    <label className="form-label">Display Name for SmartVegies App</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter a custom name for your store"
                        value={altStoreName}
                        onChange={(e) => setAltStoreName(e.target.value)}
                    />
                    <div className="form-hint">This name will be displayed to customers on SmartVegies</div>
                </div>

                {/* Profile Photo URL */}
                <div className="form-group">
                    <label className="form-label">Profile Photo URL</label>
                    <input
                        type="url"
                        className="form-input"
                        placeholder="Enter image URL"
                        value={profilePhoto}
                        onChange={(e) => setProfilePhoto(e.target.value)}
                    />
                </div>

                <button
                    className="btn btn-primary btn-full"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <div className="spinner"></div>
                            Saving...
                        </>
                    ) : (
                        <>Save Changes</>
                    )}
                </button>
            </div>

            {/* Location Card */}
            <div className="card mb-lg">
                <h3 className="mb-md">📍 Store Location</h3>
                <p className="text-sm text-muted mb-md">
                    {profile?.storeAddress || 'Location set'}
                </p>
                <p className="text-sm mb-lg">
                    <strong>District:</strong> {profile?.district || 'N/A'}
                </p>
                <button
                    className="btn btn-secondary btn-full"
                    onClick={handleChangeLocation}
                >
                    Change Location
                </button>
            </div>

            {/* FSSAI Details Card */}
            <div className="card mb-lg">
                <h3 className="mb-md">📜 FSSAI License Details</h3>
                <div className="flex flex-col gap-md text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted">License Number</span>
                        <span>{profile?.fssaiNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted">License Type</span>
                        <span>{profile?.fssaiDetails?.licenseType || 'FSSAI'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted">Status</span>
                        <span style={{ color: 'var(--success)' }}>
                            {profile?.fssaiDetails?.status || 'Active'}
                        </span>
                    </div>
                    {profile?.fssaiDetails?.expiryDate && (
                        <div className="flex justify-between">
                            <span className="text-muted">Expiry Date</span>
                            <span>{new Date(profile.fssaiDetails.expiryDate).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Logout */}
            <button
                className="btn btn-ghost btn-full"
                onClick={handleLogout}
                style={{ color: 'var(--error)' }}
            >
                🚪 Logout
            </button>

            {/* App Version */}
            <p className="text-center text-sm text-muted mt-lg">
                SmartVegis-Vendors v1.0.0
            </p>
        </div>
    );
}
