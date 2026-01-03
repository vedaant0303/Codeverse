import { useState, useEffect } from 'react';
import { listingsAPI, pricesAPI } from '../services/api';

export default function Sell() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingListing, setEditingListing] = useState(null);
    const [commodities, setCommodities] = useState({ vegetables: [], fruits: [] });

    // Form state
    const [formData, setFormData] = useState({
        commodity: '',
        category: 'vegetable',
        price: '',
        unit: 'kg',
        quantity: '',
        quality: 'standard',
        description: ''
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchListings();
        fetchCommodities();
    }, []);

    const fetchListings = async () => {
        try {
            const response = await listingsAPI.getAll();
            if (response.data.success) {
                setListings(response.data.listings);
            }
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCommodities = async () => {
        try {
            const response = await pricesAPI.getCommodities();
            if (response.data.success) {
                setCommodities(response.data.commodities);
            }
        } catch (error) {
            console.error('Error fetching commodities:', error);
        }
    };

    const openNewListingModal = () => {
        setEditingListing(null);
        setFormData({
            commodity: '',
            category: 'vegetable',
            price: '',
            unit: 'kg',
            quantity: '',
            quality: 'standard',
            description: ''
        });
        setError('');
        setShowModal(true);
    };

    const openEditModal = (listing) => {
        setEditingListing(listing);
        setFormData({
            commodity: listing.commodity,
            category: listing.category,
            price: listing.price.toString(),
            unit: listing.unit,
            quantity: listing.quantity.toString(),
            quality: listing.quality,
            description: listing.description
        });
        setError('');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.commodity || !formData.price) {
            setError('Commodity and price are required');
            return;
        }

        setSaving(true);
        try {
            if (editingListing) {
                await listingsAPI.update(editingListing._id, formData);
            } else {
                await listingsAPI.create(formData);
            }

            setShowModal(false);
            fetchListings();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save listing');
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            await listingsAPI.toggle(id);
            fetchListings();
        } catch (error) {
            console.error('Error toggling listing:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;

        try {
            await listingsAPI.delete(id);
            fetchListings();
        } catch (error) {
            console.error('Error deleting listing:', error);
        }
    };

    const getCommodityEmoji = (commodity, cat) => {
        const emojis = {
            'Tomato': '🍅', 'Onion': '🧅', 'Potato': '🥔', 'Carrot': '🥕',
            'Cabbage': '🥬', 'Cauliflower': '🥦', 'Brinjal': '🍆', 'Capsicum': '🫑',
            'Green Chilli': '🌶️', 'Cucumber': '🥒', 'Banana': '🍌', 'Mango': '🥭',
            'Orange': '🍊', 'Grapes': '🍇', 'Pomegranate': '🍎', 'Watermelon': '🍉'
        };
        return emojis[commodity] || (cat === 'fruit' ? '🍎' : '🥬');
    };

    const currentCommodities = formData.category === 'vegetable'
        ? commodities.vegetables
        : commodities.fruits;

    return (
        <div className="page">
            {/* Header */}
            <div className="flex justify-between items-center mb-lg">
                <div>
                    <h1>🛒 My Listings</h1>
                    <p className="text-sm text-muted mt-md">
                        {listings.length} items listed
                    </p>
                </div>
                <button className="btn btn-primary" onClick={openNewListingModal}>
                    + Add
                </button>
            </div>

            {/* Listings */}
            {loading ? (
                <div className="flex flex-col gap-md">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="listing-card">
                            <div className="listing-image skeleton"></div>
                            <div className="listing-content">
                                <div className="skeleton mb-md" style={{ width: '60%', height: 16 }}></div>
                                <div className="skeleton" style={{ width: '40%', height: 20 }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : listings.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <div className="empty-title">No listings yet</div>
                    <div className="empty-text">
                        Start selling by adding your first commodity
                    </div>
                    <button className="btn btn-primary" onClick={openNewListingModal}>
                        + Add Listing
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-md">
                    {listings.map((listing) => (
                        <div key={listing._id} className="listing-card">
                            <div className="listing-image">
                                {getCommodityEmoji(listing.commodity, listing.category)}
                            </div>
                            <div className="listing-content">
                                <div className="listing-header">
                                    <div className="listing-title">{listing.commodity}</div>
                                    <span className={`listing-badge ${listing.category}`}>
                                        {listing.category}
                                    </span>
                                </div>
                                <div className="listing-price">
                                    ₹{listing.price}/{listing.unit}
                                </div>
                                <div className="listing-meta">
                                    <span>📦 {listing.quantity} {listing.unit}</span>
                                    <span>⭐ {listing.quality}</span>
                                    <span style={{ color: listing.isAvailable ? 'var(--success)' : 'var(--error)' }}>
                                        {listing.isAvailable ? '✓ Available' : '✗ Unavailable'}
                                    </span>
                                </div>
                                <div className="listing-actions">
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => openEditModal(listing)}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-ghost"
                                        onClick={() => handleToggle(listing._id)}
                                    >
                                        {listing.isAvailable ? '🔴 Disable' : '🟢 Enable'}
                                    </button>
                                    <button
                                        className="btn btn-sm btn-ghost"
                                        onClick={() => handleDelete(listing._id)}
                                        style={{ color: 'var(--error)' }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {editingListing ? 'Edit Listing' : 'Add New Listing'}
                            </h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                ✕
                            </button>
                        </div>

                        {error && (
                            <div className="verification-status error mb-md">
                                <span>❌</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Category Selection */}
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <div className="tabs">
                                    <button
                                        type="button"
                                        className={`tab ${formData.category === 'vegetable' ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, category: 'vegetable', commodity: '' })}
                                    >
                                        🥬 Vegetable
                                    </button>
                                    <button
                                        type="button"
                                        className={`tab ${formData.category === 'fruit' ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, category: 'fruit', commodity: '' })}
                                    >
                                        🍎 Fruit
                                    </button>
                                </div>
                            </div>

                            {/* Commodity */}
                            <div className="form-group">
                                <label className="form-label">Commodity</label>
                                <select
                                    className="form-input"
                                    value={formData.commodity}
                                    onChange={(e) => setFormData({ ...formData, commodity: e.target.value })}
                                    required
                                >
                                    <option value="">Select commodity</option>
                                    {currentCommodities.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price and Unit */}
                            <div className="flex gap-md">
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label className="form-label">Price (₹)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Enter price"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Unit</label>
                                    <select
                                        className="form-input"
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    >
                                        <option value="kg">kg</option>
                                        <option value="dozen">dozen</option>
                                        <option value="piece">piece</option>
                                        <option value="bundle">bundle</option>
                                    </select>
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="form-group">
                                <label className="form-label">Available Quantity</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Enter available quantity"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                />
                            </div>

                            {/* Quality */}
                            <div className="form-group">
                                <label className="form-label">Quality</label>
                                <select
                                    className="form-input"
                                    value={formData.quality}
                                    onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                                >
                                    <option value="premium">Premium</option>
                                    <option value="standard">Standard</option>
                                    <option value="economy">Economy</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div className="form-group">
                                <label className="form-label">Description (Optional)</label>
                                <textarea
                                    className="form-input"
                                    placeholder="Add any additional details..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <div className="spinner"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>{editingListing ? 'Update Listing' : 'Add Listing'}</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
