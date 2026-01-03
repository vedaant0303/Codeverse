import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ category, onClick, isActive, index }) => {
  const labels = ['Category One', 'Category Two', 'Category Three'];

  return (
    <div className={`category-card ${isActive ? 'active' : ''}`} onClick={onClick}>
      <span className="category-label">{labels[index] || `Category ${index + 1}`}</span>
      <img src={category.icon} alt={category.name} className="category-icon" />
      <div className="category-content">
        <span className="category-name">{category.name}</span>
        <span className="category-count">{category.count} fresh items available</span>
      </div>
    </div>
  );
};

export default CategoryCard;
