import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
    fssaiNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
        minlength: 14,
        maxlength: 14
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    // Store name fetched from FSSAI API - read only
    storeName: {
        type: String,
        required: true
    },
    // User editable alt name for SmartVegies app
    altStoreName: {
        type: String,
        default: ''
    },
    // Store address from FSSAI API
    storeAddress: {
        type: String,
        default: ''
    },
    // Geospatial location
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },
    district: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: 'Maharashtra'
    },
    pincode: {
        type: String,
        default: ''
    },
    // Photos
    profilePhoto: {
        type: String,
        default: ''
    },
    storePhotos: [{
        type: String
    }],
    // Status flags
    isLocationSet: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // FSSAI license details from API
    fssaiDetails: {
        licenseType: String,
        expiryDate: Date,
        issuedDate: Date,
        status: String,
        products: [String]
    }
}, {
    timestamps: true
});

// Create geospatial index for location-based queries
vendorSchema.index({ location: '2dsphere' });

const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;
