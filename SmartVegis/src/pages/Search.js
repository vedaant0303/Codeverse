import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products, commodities } from '../data/sampleData';
import './Search.css';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('relevance');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    // Update search query from URL params
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('category') || 'All';
    setSearchQuery(q);
    setSelectedCategory(cat);
  }, [searchParams]);

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
        // Keep default order for relevance
        break;
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, sortBy, availabilityFilter]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="search-page">
      <div className="container">
        {/* Search Header */}
        <div className="search-header">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search vegetables, fruits, vendors..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-page-input"
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
          <div className="search-results-count">
            Found <strong>{filteredProducts.length}</strong> products
            {searchQuery && <span> for "{searchQuery}"</span>}
            {selectedCategory !== 'All' && <span> in {selectedCategory}</span>}
          </div>
        </div>

        <div className="search-content">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3>Commodities</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'All'}
                    onChange={() => setSelectedCategory('All')}
                  />
                  <span>All Commodities</span>
                </label>
                {commodities.map(cat => (
                  <label key={cat.id} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.name}
                      onChange={() => setSelectedCategory(cat.name)}
                    />
                    <img src={cat.icon} alt={cat.name} className="filter-icon" />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Availability</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="availability"
                    checked={availabilityFilter === 'all'}
                    onChange={() => setAvailabilityFilter('all')}
                  />
                  <span>All</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="availability"
                    checked={availabilityFilter === 'inStock'}
                    onChange={() => setAvailabilityFilter('inStock')}
                  />
                  <span>In Stock</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="availability"
                    checked={availabilityFilter === 'lowStock'}
                    onChange={() => setAvailabilityFilter('lowStock')}
                  />
                  <span>Low Stock</span>
                </label>
              </div>
            </div>

            <div className="filter-section">
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
          </aside>

          {/* Products Grid */}
          <main className="search-results">
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
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Search;
