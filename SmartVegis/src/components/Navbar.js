import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import { LocationIcon, SearchIcon, ChevronDownIcon } from './Icons';
import './Navbar.css';

const Navbar = () => {
  const { address, loading, detectLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="SmartVegis Logo" className="logo-image" />
        </Link>

        {/* Location Display */}
        <div className="location-display" onClick={detectLocation}>
          <span className="location-icon"><LocationIcon size={18} color="#059669" /></span>
          <div className="location-info">
            <span className="location-label">Deliver to</span>
            <span className="location-address">
              {loading ? 'Detecting...' : address}
            </span>
          </div>
          <span className="location-arrow"><ChevronDownIcon size={14} /></span>
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
