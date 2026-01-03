import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import VendorCard from '../components/VendorCard';
import { LocationIcon, CheckIcon, WalletIcon, StoreIcon, FireIcon } from '../components/Icons';
import { products, commodities, vendors } from '../data/sampleData';
import './Home.css';

const Home = () => {
  const { address, loading: locationLoading } = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCommodityClick = (commodityName) => {
    if (selectedCategory === commodityName) {
      setSelectedCategory(null); // Close if already open
    } else {
      setSelectedCategory(commodityName); // Open selected category
    }
  };

  const handleVendorClick = (vendorId) => {
    navigate(`/vendor/${vendorId}`);
  };

  // Get products by category (including sub-categories)
  const getCategoryProducts = (categoryName) => {
    if (categoryName === 'Vegetables') {
      // Include all vegetable-related categories
      return products.filter(product =>
        ['Vegetables', 'Leafy Greens', 'Root Veggies'].includes(product.category)
      );
    } else if (categoryName === 'Fruits') {
      // Include all fruit-related categories
      return products.filter(product =>
        ['Fruits', 'Exotic Fruits', 'Citrus'].includes(product.category)
      );
    }
    return products.filter(product => product.category === categoryName);
  };

  // Get featured products (first 8)
  const featuredProducts = products.slice(0, 8);

  // Get deals (products with discounts)
  const dealsProducts = products.filter(p => p.originalPrice !== null).slice(0, 4);

  return (
    <div className="home">
      {/* Hero Section with Background Image */}
      <section className="hero">
        <div className="hero-bg-image" style={{ backgroundImage: 'url(/hero-bg.jpg)' }}></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Fresh, Nutritious,</h1>
            <h2>Authentically Local.</h2>
            <p className="hero-subtitle">
              Bringing the best of local farms to your table
            </p>
            <button className="explore-btn" onClick={() => navigate('/search')}>
              Explore Products
            </button>
          </div>
        </div>
      </section>

      {/* Commodities Section */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <div className="section-title-group">
              <h2>Our Specialties</h2>
              <p className="section-subtitle">From fresh vegetables to exotic fruits — everything crafted for freshness, nutrition, and authentic flavor.</p>
            </div>
            <button className="view-all-btn" onClick={() => navigate('/search')}>
              View All Products
            </button>
          </div>
          <div className="categories-grid">
            {commodities.map((commodity, index) => (
              <CategoryCard
                key={commodity.id}
                category={commodity}
                index={index}
                isActive={selectedCategory === commodity.name}
                onClick={() => handleCommodityClick(commodity.name)}
              />
            ))}
          </div>

          {/* Expandable Products List */}
          {selectedCategory && (
            <div className="category-products-panel">
              <div className="category-products-header">
                <h3>Available {selectedCategory}</h3>
                <span className="products-count">{getCategoryProducts(selectedCategory).length} items found</span>
              </div>
              <div className="category-products-grid">
                {getCategoryProducts(selectedCategory).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {getCategoryProducts(selectedCategory).length === 0 && (
                <div className="no-products-message">
                  <p>No {selectedCategory.toLowerCase()} available at the moment.</p>
                </div>
              )}
            </div>
          )}
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
