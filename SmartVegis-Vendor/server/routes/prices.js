import express from 'express';
import { getMandiPrices, COMMODITIES_LIST } from '../services/mandiPriceService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/prices
 * Get mandi prices based on vendor's district
 */
router.get('/', async (req, res) => {
    try {
        const { district, category, search } = req.query;

        let prices = await getMandiPrices(district || '', 'Maharashtra');

        // Filter by category if specified
        if (category && category !== 'all') {
            prices = prices.filter(p => p.category === category);
        }

        // Filter by search term
        if (search) {
            const searchLower = search.toLowerCase();
            prices = prices.filter(p =>
                p.commodity.toLowerCase().includes(searchLower)
            );
        }

        res.json({
            success: true,
            count: prices.length,
            prices
        });

    } catch (error) {
        console.error('Get Prices Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error fetching prices'
        });
    }
});

/**
 * GET /api/prices/commodities
 * Get list of available commodities
 */
router.get('/commodities', async (req, res) => {
    try {
        res.json({
            success: true,
            commodities: COMMODITIES_LIST
        });
    } catch (error) {
        console.error('Get Commodities Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

export default router;
