import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ category, onClick }) => {
  return (
    <div className="category-card" onClick={onClick}>
      <img src={category.icon} alt={category.name} className="category-icon" />
      <span className="category-name">{category.name}</span>
      <span className="category-count">{category.count} items</span>
    </div>
  );
};

export default CategoryCard;
