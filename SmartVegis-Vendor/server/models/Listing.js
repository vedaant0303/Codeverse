import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
        index: true
    },
    commodity: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['vegetable', 'fruit'],
        required: true
    },
    // Subcategory for more specific classification
    subcategory: {
        type: String,
        default: ''
    },
    // Pricing
    price: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        enum: ['kg', 'dozen', 'piece', 'bundle', 'quintal'],
        default: 'kg'
    },
    // Stock
    quantity: {
        type: Number,
        default: 0
    },
    minOrderQuantity: {
        type: Number,
        default: 1
    },
    // Description and details
    description: {
        type: String,
        default: ''
    },
    quality: {
        type: String,
        enum: ['premium', 'standard', 'economy'],
        default: 'standard'
    },
    // Images
    images: [{
        type: String
    }],
    // Availability
    isAvailable: {
        type: Boolean,
        default: true
    },
    // Location copied from vendor for geospatial queries
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    district: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Create indexes for efficient queries
listingSchema.index({ location: '2dsphere' });
listingSchema.index({ commodity: 'text' });
listingSchema.index({ category: 1, isAvailable: 1 });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
