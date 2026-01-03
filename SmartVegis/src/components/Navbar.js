import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import { LocationIcon, SearchIcon, ChevronDownIcon } from './Icons';
import './Navbar.css';

const Navbar = () => {
  const { address, loading, detectLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();

  // Check if we're on home page
  const isHomePage = routerLocation.pathname === '/';

  // Add scroll listener to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Navbar is solid unless on home page and not scrolled
  const navbarClass = `navbar ${(!isHomePage || isScrolled) ? 'scrolled' : ''}`;

  return (
    <nav className={navbarClass}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="SmartVegis Logo" className="logo-image" />
        </Link>

        {/* Location Display */}
        <div className="location-display" onClick={detectLocation}>
          <span className="location-icon"><LocationIcon size={18} color="#fbbf24" /></span>
          <div className="location-info">
            <span className="location-label">Deliver to</span>
            <span className="location-address">
              {loading ? 'Detecting...' : address}
            </span>
          </div>
          <span className="location-arrow"><ChevronDownIcon size={14} color="#ffffff" /></span>
        </div>

        {/* Search Bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for vegetables, fruits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <SearchIcon size={18} color="#ffffff" />
          </button>
        </form>

        {/* Nav Links */}
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/search" className="nav-link">Browse</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
