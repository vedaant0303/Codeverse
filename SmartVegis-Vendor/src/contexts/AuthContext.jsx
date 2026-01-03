import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem('token');
        const storedVendor = localStorage.getItem('vendor');

        if (token && storedVendor) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 > Date.now()) {
                    setVendor(JSON.parse(storedVendor));
                } else {
                    // Token expired, clear storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('vendor');
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('vendor');
            }
        }
        setLoading(false);
    }, []);

    const login = (token, vendorData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('vendor', JSON.stringify(vendorData));
        setVendor(vendorData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('vendor');
        setVendor(null);
    };

    const updateVendor = (updates) => {
        const updatedVendor = { ...vendor, ...updates };
        localStorage.setItem('vendor', JSON.stringify(updatedVendor));
        setVendor(updatedVendor);
    };

    const value = {
        vendor,
        loading,
        isAuthenticated: !!vendor,
        login,
        logout,
        updateVendor
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
