import { NavLink } from 'react-router-dom';

export default function BottomNav() {
    return (
        <nav className="bottom-nav">
            <NavLink
                to="/"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <span className="nav-icon">📊</span>
                <span className="nav-label">Prices</span>
            </NavLink>

            <NavLink
                to="/sell"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <span className="nav-icon">🛒</span>
                <span className="nav-label">Sell</span>
            </NavLink>

            <NavLink
                to="/settings"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <span className="nav-icon">⚙️</span>
                <span className="nav-label">Settings</span>
            </NavLink>
        </nav>
    );
}
