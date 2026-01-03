import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products, commodities } from '../data/sampleData';
import './Search.css';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('relevance');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    let result = [...products];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.vendor.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Filter by availability
    if (availabilityFilter === 'inStock') {
      result = result.filter(product => product.availability === 'In Stock');
    } else if (availabilityFilter === 'lowStock') {
      result = result.filter(product => product.availability === 'Low Stock');
    }

    // Sort products
    switch (sortBy) {
      case 'priceLow':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        result.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, sortBy, availabilityFilter]);

  return (
    <div className="search-page">
      <div className="container">
        {/* Page Title */}
        <div className="browse-header">
          <h1>Browse Products</h1>
        </div>

        {/* Horizontal Filters Bar */}
        <div className="filters-bar">
          {/* Commodities Filter */}
          <div className="filter-card">
            <h3>Commodities</h3>
            <div className="filter-chips">
              <button
                className={`filter-chip ${selectedCategory === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('All')}
              >
                All
              </button>
              {commodities.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-chip ${selectedCategory === cat.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  <img src={cat.icon} alt={cat.name} className="chip-icon" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="filter-card">
            <h3>Availability</h3>
            <div className="filter-chips">
              <button
                className={`filter-chip ${availabilityFilter === 'all' ? 'active' : ''}`}
                onClick={() => setAvailabilityFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-chip ${availabilityFilter === 'inStock' ? 'active' : ''}`}
                onClick={() => setAvailabilityFilter('inStock')}
              >
                🟢 In Stock
              </button>
              <button
                className={`filter-chip ${availabilityFilter === 'lowStock' ? 'active' : ''}`}
                onClick={() => setAvailabilityFilter('lowStock')}
              >
                🟡 Low Stock
              </button>
            </div>
          </div>

          {/* Sort By */}
          <div className="filter-card sort-card">
            <h3>Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="relevance">Relevance</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="distance">Nearest First</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-section">
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <span className="no-results-emoji">🔍</span>
              <h3>No products found</h3>
              <p>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
