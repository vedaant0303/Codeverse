import React from 'react';
import { LocationIcon, StarIcon } from './Icons';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const {
    name,
    image,
    price,
    unit,
    originalPrice,
    availability,
    vendor,
    distance,
    rating
  } = product;

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const getAvailabilityClass = () => {
    if (availability === 'In Stock') return 'in-stock';
    if (availability === 'Low Stock') return 'low-stock';
    return 'out-of-stock';
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={name} className="product-img" />
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>

        <div className="product-meta">
          <div className="product-price">
            <span className="current-price">₹{price}</span>
            <span className="price-unit">/{unit}</span>
          </div>
          <div className={`availability ${getAvailabilityClass()}`}>
            <span className="availability-dot"></span>
            {availability}
          </div>
        </div>

        <div className="vendor-info">
          <span className="vendor-name">{vendor}</span>
          <span className="vendor-distance"><LocationIcon size={12} /> {distance}</span>
        </div>

        <div className="product-footer">
          {rating && (
            <div className="product-rating">
              <StarIcon size={14} />
              <span className="rating-value">{rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
