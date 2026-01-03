import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { pricesAPI } from '../services/api';

export default function Home() {
    const { vendor } = useAuth();
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchPrices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    const fetchPrices = async () => {
        try {
            const params = { district: vendor?.district || '' };
            if (category !== 'all') {
                params.category = category;
            }
            if (search) {
                params.search = search;
            }

            const response = await pricesAPI.getAll(params);
            if (response.data.success) {
                setPrices(response.data.prices);
            }
        } catch (error) {
            console.error('Error fetching prices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        fetchPrices();
    };

    // Format price to INR per kg
    const formatPrice = (pricePerQuintal) => {
        const pricePerKg = pricePerQuintal / 100;
        return `₹${pricePerKg.toFixed(0)}`;
    };

    const getCommodityEmoji = (commodity, cat) => {
        const emojis = {
            'Tomato': '🍅', 'Onion': '🧅', 'Potato': '🥔', 'Carrot': '🥕',
            'Cabbage': '🥬', 'Cauliflower': '🥦', 'Brinjal': '🍆', 'Capsicum': '🫑',
            'Green Chilli': '🌶️', 'Cucumber': '🥒', 'Spinach': '🥬', 'Lady Finger': '🥒',
            'Banana': '🍌', 'Mango': '🥭', 'Orange': '🍊', 'Grapes': '🍇',
            'Pomegranate': '🍎', 'Watermelon': '🍉', 'Papaya': '🥭', 'Guava': '🍐',
            'Apple': '🍎', 'Pineapple': '🍍', 'Lemon': '🍋'
        };
        return emojis[commodity] || (cat === 'fruit' ? '🍎' : '🥬');
    };

    const filteredPrices = prices.filter(p =>
        !search || p.commodity.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page">
            {/* Header */}
            <div className="mb-lg">
                <h1>📊 Mandi Prices</h1>
                <p className="text-sm text-muted mt-md">
                    Real-time prices from {vendor?.district || 'Maharashtra'} markets
                </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search commodities..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </form>

            {/* Category Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${category === 'all' ? 'active' : ''}`}
                    onClick={() => setCategory('all')}
                >
                    All
                </button>
                <button
                    className={`tab ${category === 'vegetable' ? 'active' : ''}`}
                    onClick={() => setCategory('vegetable')}
                >
                    🥬 Vegetables
                </button>
                <button
                    className={`tab ${category === 'fruit' ? 'active' : ''}`}
                    onClick={() => setCategory('fruit')}
                >
                    🍎 Fruits
                </button>
            </div>

            {/* Price Cards */}
            {loading ? (
                <div className="flex flex-col gap-md">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="price-card">
                            <div className="skeleton" style={{ width: 48, height: 48 }}></div>
                            <div className="flex-1">
                                <div className="skeleton mb-md" style={{ width: '60%', height: 16 }}></div>
                                <div className="skeleton" style={{ width: '40%', height: 12 }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredPrices.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <div className="empty-title">No prices found</div>
                    <div className="empty-text">
                        Try searching for a different commodity
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-md">
                    {filteredPrices.map((price, index) => (
                        <div key={index} className="price-card">
                            <div className="price-icon">
                                {getCommodityEmoji(price.commodity, price.category)}
                            </div>
                            <div className="price-info">
                                <div className="price-commodity">{price.commodity}</div>
                                <div className="price-market">
                                    {price.variety} • {price.market}
                                </div>
                            </div>
                            <div className="price-value">
                                <div className="price-modal">{formatPrice(price.modalPrice)}/kg</div>
                                <div className="price-range">
                                    {formatPrice(price.minPrice)} - {formatPrice(price.maxPrice)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
