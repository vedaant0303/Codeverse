import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { LocationIcon, StarIcon, TrophyIcon, PhoneIcon, PackageIcon, CircleDotIcon } from '../components/Icons';
import { getVendorById, getProductsByVendor } from '../data/sampleData';
import './VendorDetail.css';

const VendorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const vendor = getVendorById(id);
  const vendorProducts = getProductsByVendor(id);

  if (!vendor) {
    return (
      <div className="vendor-not-found">
        <h2>Vendor not found</h2>
        <button onClick={() => navigate('/')}>Go Back Home</button>
      </div>
    );
  }

  return (
    <div className="vendor-detail-page">
      <div className="container">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Vendor Header */}
        <div className="vendor-header">
          <div className="vendor-header-image">
            <img src={vendor.image} alt={vendor.name} className="vendor-large-img" />
          </div>
          <div className="vendor-header-info">
            <div className="vendor-status-badge">
              <span className={`status ${vendor.isOpen ? 'open' : 'closed'}`}>
                <CircleDotIcon size={6} color="#ffffff" />
                <span>{vendor.isOpen ? 'Open Now' : 'Closed'}</span>
              </span>
              <span className="timing">
                {vendor.openTime} - {vendor.closeTime}
              </span>
            </div>
            <h1 className="vendor-title">{vendor.name}</h1>
            <p className="vendor-description">{vendor.description}</p>
            
            <div className="vendor-stats">
              <div className="stat-item">
                <span className="stat-icon"><StarIcon size={16} /></span>
                <span className="stat-value">{vendor.rating}</span>
                <span className="stat-label">({vendor.totalRatings} reviews)</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon"><LocationIcon size={16} /></span>
                <span className="stat-value">{vendor.distance}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon"><TrophyIcon size={16} /></span>
                <span className="stat-value">{vendor.yearsInBusiness} years</span>
                <span className="stat-label">in business</span>
              </div>
            </div>

            <div className="vendor-speciality">
              <span className="speciality-badge">{vendor.speciality}</span>
            </div>
          </div>
        </div>

        {/* Vendor Contact Info */}
        <div className="vendor-contact">
          <div className="contact-item">
            <span className="contact-icon"><LocationIcon size={20} color="#059669" /></span>
            <div className="contact-info">
              <span className="contact-label">Address</span>
              <span className="contact-value">{vendor.address}</span>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon"><PhoneIcon size={20} color="#059669" /></span>
            <div className="contact-info">
              <span className="contact-label">Phone</span>
              <span className="contact-value">{vendor.phone}</span>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="vendor-products-section">
          <div className="section-header">
            <h2>Products by {vendor.name}</h2>
            <span className="product-count">{vendorProducts.length} items available</span>
          </div>

          {vendorProducts.length > 0 ? (
            <div className="products-grid">
              {vendorProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <span className="no-products-icon"><PackageIcon size={48} color="#9ca3af" /></span>
              <p>No products available from this vendor at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDetail;
