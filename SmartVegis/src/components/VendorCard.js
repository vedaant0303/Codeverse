import React from 'react';
import { LocationIcon, StarIcon, CircleDotIcon, PackageIcon } from './Icons';
import './VendorCard.css';

const VendorCard = ({ vendor, onClick }) => {
  const {
    name,
    image,
    rating,
    totalRatings,
    distance,
    isOpen,
    speciality,
    productIds
  } = vendor;

  return (
    <div className="vendor-card" onClick={onClick}>
      <div className="vendor-header">
        <div className="vendor-image">
          <img src={image} alt={name} className="vendor-img" />
        </div>
        <span className={`status-badge ${isOpen ? 'open' : 'closed'}`}>
          <CircleDotIcon size={6} color={isOpen ? '#ffffff' : '#ffffff'} />
          <span>{isOpen ? 'Open' : 'Closed'}</span>
        </span>
      </div>

      <div className="vendor-body">
        <h3 className="vendor-name">{name}</h3>
        
        <div className="vendor-details">
          <div className="vendor-rating">
            <StarIcon size={14} />
            <span className="rating-value">{rating}</span>
            <span className="rating-count">({totalRatings})</span>
          </div>
          <span className="vendor-distance"><LocationIcon size={12} /> {distance}</span>
        </div>

        <div className="vendor-footer">
          <span className="speciality-tag">{speciality}</span>
          <span className="items-count"><PackageIcon size={12} /> {productIds.length} items</span>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
