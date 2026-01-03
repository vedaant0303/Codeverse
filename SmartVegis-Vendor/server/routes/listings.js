import express from 'express';
import Listing from '../models/Listing.js';
import Vendor from '../models/Vendor.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/listings
 * Get all listings for current vendor
 */
router.get('/', async (req, res) => {
    try {
        const { category, available } = req.query;

        const filter = { vendorId: req.vendor.id };

        if (category) {
            filter.category = category;
        }

        if (available !== undefined) {
            filter.isAvailable = available === 'true';
        }

        const listings = await Listing.find(filter)
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: listings.length,
            listings
        });

    } catch (error) {
        console.error('Get Listings Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

/**
 * GET /api/listings/:id
 * Get single listing
 */
router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findOne({
            _id: req.params.id,
            vendorId: req.vendor.id
        });

        if (!listing) {
            return res.status(404).json({
                success: false,
                error: 'Listing not found'
            });
        }

        res.json({
            success: true,
            listing
        });

    } catch (error) {
        console.error('Get Listing Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

/**
 * POST /api/listings
 * Create new listing
 */
router.post('/', async (req, res) => {
    try {
        const {
            commodity,
            category,
            subcategory,
            price,
            unit,
            quantity,
            minOrderQuantity,
            description,
            quality,
            images
        } = req.body;

        if (!commodity || !category || !price) {
            return res.status(400).json({
                success: false,
                error: 'Commodity, category, and price are required'
            });
        }

        // Get vendor's location for the listing
        const vendor = await Vendor.findById(req.vendor.id);

        const listing = new Listing({
            vendorId: req.vendor.id,
            commodity,
            category,
            subcategory: subcategory || '',
            price: parseFloat(price),
            unit: unit || 'kg',
            quantity: quantity || 0,
            minOrderQuantity: minOrderQuantity || 1,
            description: description || '',
            quality: quality || 'standard',
            images: images || [],
            location: vendor.location,
            district: vendor.district
        });

        await listing.save();

        res.status(201).json({
            success: true,
            listing
        });

    } catch (error) {
        console.error('Create Listing Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

/**
 * PUT /api/listings/:id
 * Update listing
 */
router.put('/:id', async (req, res) => {
    try {
        const {
            commodity,
            category,
            subcategory,
            price,
            unit,
            quantity,
            minOrderQuantity,
            description,
            quality,
            images,
            isAvailable
        } = req.body;

        const updateFields = {};

        if (commodity !== undefined) updateFields.commodity = commodity;
        if (category !== undefined) updateFields.category = category;
        if (subcategory !== undefined) updateFields.subcategory = subcategory;
        if (price !== undefined) updateFields.price = parseFloat(price);
        if (unit !== undefined) updateFields.unit = unit;
        if (quantity !== undefined) updateFields.quantity = quantity;
        if (minOrderQuantity !== undefined) updateFields.minOrderQuantity = minOrderQuantity;
        if (description !== undefined) updateFields.description = description;
        if (quality !== undefined) updateFields.quality = quality;
        if (images !== undefined) updateFields.images = images;
        if (isAvailable !== undefined) updateFields.isAvailable = isAvailable;

        const listing = await Listing.findOneAndUpdate(
            { _id: req.params.id, vendorId: req.vendor.id },
            { $set: updateFields },
            { new: true }
        );

        if (!listing) {
            return res.status(404).json({
                success: false,
                error: 'Listing not found'
            });
        }

        res.json({
            success: true,
            listing
        });

    } catch (error) {
        console.error('Update Listing Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

/**
 * DELETE /api/listings/:id
 * Delete listing
 */
router.delete('/:id', async (req, res) => {
    try {
        const listing = await Listing.findOneAndDelete({
            _id: req.params.id,
            vendorId: req.vendor.id
        });

        if (!listing) {
            return res.status(404).json({
                success: false,
                error: 'Listing not found'
            });
        }

        res.json({
            success: true,
            message: 'Listing deleted successfully'
        });

    } catch (error) {
        console.error('Delete Listing Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

/**
 * PATCH /api/listings/:id/toggle
 * Toggle listing availability
 */
router.patch('/:id/toggle', async (req, res) => {
    try {
        const listing = await Listing.findOne({
            _id: req.params.id,
            vendorId: req.vendor.id
        });

        if (!listing) {
            return res.status(404).json({
                success: false,
                error: 'Listing not found'
            });
        }

        listing.isAvailable = !listing.isAvailable;
        await listing.save();

        res.json({
            success: true,
            listing
        });

    } catch (error) {
        console.error('Toggle Listing Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

export default router;
