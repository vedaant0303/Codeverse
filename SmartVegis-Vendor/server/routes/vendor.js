import express from 'express';
import Vendor from '../models/Vendor.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/vendor/profile
 * Get current vendor's profile
 */
router.get('/profile', async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.vendor.id).select('-password');

        if (!vendor) {
            return res.status(404).json({
                success: false,
                error: 'Vendor not found'
            });
        }

        res.json({
            success: true,
            vendor
        });

    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

/**
 * PUT /api/vendor/profile
 * Update vendor profile (photos, alt name, etc.)
 */
router.put('/profile', async (req, res) => {
    try {
        const { altStoreName, profilePhoto, storePhotos } = req.body;

        const updateFields = {};

        if (altStoreName !== undefined) {
            updateFields.altStoreName = altStoreName;
        }

        if (profilePhoto !== undefined) {
            updateFields.profilePhoto = profilePhoto;
        }

        if (storePhotos !== undefined) {
            updateFields.storePhotos = storePhotos;
        }

        const vendor = await Vendor.findByIdAndUpdate(
            req.vendor.id,
            { $set: updateFields },
            { new: true }
        ).select('-password');

        if (!vendor) {
            return res.status(404).json({
                success: false,
                error: 'Vendor not found'
            });
        }

        res.json({
            success: true,
            vendor
        });

    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

/**
 * PUT /api/vendor/location
 * Set or update vendor's store location
 */
router.put('/location', async (req, res) => {
    try {
        const { latitude, longitude, district, address, pincode } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: 'Latitude and longitude are required'
            });
        }

        const vendor = await Vendor.findByIdAndUpdate(
            req.vendor.id,
            {
                $set: {
                    location: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    district: district || '',
                    storeAddress: address || '',
                    pincode: pincode || '',
                    isLocationSet: true
                }
            },
            { new: true }
        ).select('-password');

        if (!vendor) {
            return res.status(404).json({
                success: false,
                error: 'Vendor not found'
            });
        }

        res.json({
            success: true,
            vendor
        });

    } catch (error) {
        console.error('Update Location Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

export default router;
