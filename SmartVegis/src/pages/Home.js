import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import VendorCard from '../components/VendorCard';
import { LocationIcon, TruckIcon, CheckIcon, WalletIcon, StoreIcon, FireIcon } from '../components/Icons';
import { products, commodities, vendors } from '../data/sampleData';
import './Home.css';

const Home = () => {
  const { address, loading: locationLoading } = useLocation();
  const navigate = useNavigate();

  const handleCommodityClick = (commodityName) => {
    navigate(`/search?category=${encodeURIComponent(commodityName)}`);
  };

  const handleVendorClick = (vendorId) => {
    navigate(`/vendor/${vendorId}`);
  };

  // Get featured products (first 8)
  const featuredProducts = products.slice(0, 8);

  // Get deals (products with discounts)
  const dealsProducts = products.filter(p => p.originalPrice !== null).slice(0, 4);

  return (
    <div className="home">
      {/* Hero Section with Video Background */}
      <section className="hero">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Fresh Vegetables & Fruits</h1>
            <h2>Delivered to Your Doorstep</h2>
            <p className="hero-location">
              {locationLoading ? (
                <span className="location-detecting">
                  <span className="pulse-dot"></span>
                  Detecting your location...
                </span>
              ) : (
                <>
                  <span className="location-pin"><LocationIcon size={16} color="#ffffff" /></span>
                  Showing markets near <strong>{address}</strong>
                </>
              )}
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Vendors</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Live Prices</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop" alt="Fresh Fruits" className="hero-img" />
          </div>
        </div>
      </section>

      {/* Commodities Section */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Commodity</h2>
            <button className="view-all-btn" onClick={() => navigate('/search')}>
              View All →
            </button>
          </div>
          <div className="categories-grid">
            {commodities.map(commodity => (
              <CategoryCard
                key={commodity.id}
                category={commodity}
                onClick={() => handleCommodityClick(commodity.name)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Vendors Section */}
      <section className="section vendors-section">
        <div className="container">
          <div className="section-header">
            <h2><StoreIcon size={24} color="#059669" /> Vendors Near You</h2>
            <button className="view-all-btn" onClick={() => navigate('/search')}>
              View All →
            </button>
          </div>
          <div className="vendors-grid">
            {vendors.map(vendor => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onClick={() => handleVendorClick(vendor.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      {dealsProducts.length > 0 && (
        <section className="section deals-section">
          <div className="container">
            <div className="section-header">
              <h2><FireIcon size={24} color="#ef4444" /> Today's Best Deals</h2>
              <button className="view-all-btn" onClick={() => navigate('/search')}>
                View All →
              </button>
            </div>
            <div className="products-grid">
              {dealsProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products Near You</h2>
            <button className="view-all-btn" onClick={() => navigate('/search')}>
              View All →
            </button>
          </div>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="info-banner">
        <div className="container">
          <div className="info-items">
            <div className="info-item">
              <span className="info-icon"><TruckIcon size={24} color="#059669" /></span>
              <div className="info-text">
                <h4>Fast Delivery</h4>
                <p>Within 30 minutes</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon"><CheckIcon size={24} color="#059669" /></span>
              <div className="info-text">
                <h4>Fresh Guarantee</h4>
                <p>100% fresh or refund</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon"><WalletIcon size={24} color="#059669" /></span>
              <div className="info-text">
                <h4>Best Prices</h4>
                <p>Compare across vendors</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon"><LocationIcon size={24} color="#059669" /></span>
              <div className="info-text">
                <h4>Local Markets</h4>
                <p>Support local vendors</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
