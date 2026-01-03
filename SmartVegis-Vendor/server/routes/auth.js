import express from 'express';
import bcrypt from 'bcryptjs';
import Vendor from '../models/Vendor.js';
import { verifyFSSAILicense } from '../services/gridlinesService.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/verify-fssai
 * Verify FSSAI license number before signup
 */
router.post('/verify-fssai', async (req, res) => {
    try {
        const { fssaiNumber } = req.body;

        if (!fssaiNumber || fssaiNumber.length !== 14) {
            return res.status(400).json({
                success: false,
                error: 'FSSAI number must be 14 digits'
            });
        }

        // Check if vendor already exists
        const existingVendor = await Vendor.findOne({ fssaiNumber });
        if (existingVendor) {
            return res.status(400).json({
                success: false,
                error: 'Vendor with this FSSAI number already registered'
            });
        }

        // Verify with Gridlines API
        const verification = await verifyFSSAILicense(fssaiNumber);

        if (!verification.success || !verification.verified) {
            return res.status(400).json({
                success: false,
                error: verification.error || 'FSSAI verification failed'
            });
        }

        res.json({
            success: true,
            verified: true,
            data: verification.data,
            isMock: verification.isMock || false
        });

    } catch (error) {
        console.error('FSSAI Verification Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during verification'
        });
    }
});

/**
 * POST /api/auth/signup
 * Register new vendor after FSSAI verification
 */
router.post('/signup', async (req, res) => {
    try {
        const { fssaiNumber, phoneNumber, name, password, fssaiData } = req.body;

        // Validation
        if (!fssaiNumber || !phoneNumber || !name || !password) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters'
            });
        }

        // Check if vendor already exists
        const existingVendor = await Vendor.findOne({ fssaiNumber });
        if (existingVendor) {
            return res.status(400).json({
                success: false,
                error: 'Vendor with this FSSAI number already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create vendor
        const vendor = new Vendor({
            fssaiNumber,
            phoneNumber,
            name,
            password: hashedPassword,
            storeName: fssaiData?.companyName || `Store ${fssaiNumber.slice(-4)}`,
            storeAddress: fssaiData?.address || '',
            district: fssaiData?.district || '',
            state: fssaiData?.state || 'Maharashtra',
            pincode: fssaiData?.pincode || '',
            fssaiDetails: {
                licenseType: fssaiData?.licenseType || 'FSSAI',
                expiryDate: fssaiData?.expiryDate,
                issuedDate: fssaiData?.issuedDate,
                status: fssaiData?.status || 'Active',
                products: fssaiData?.products || []
            }
        });

        await vendor.save();

        // Generate token
        const token = generateToken(vendor);

        res.status(201).json({
            success: true,
            token,
            vendor: {
                id: vendor._id,
                fssaiNumber: vendor.fssaiNumber,
                name: vendor.name,
                storeName: vendor.storeName,
                isLocationSet: vendor.isLocationSet
            }
        });

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during signup'
        });
    }
});

/**
 * POST /api/auth/login
 * Login with FSSAI number and password
 */
router.post('/login', async (req, res) => {
    try {
        const { fssaiNumber, password } = req.body;

        if (!fssaiNumber || !password) {
            return res.status(400).json({
                success: false,
                error: 'FSSAI number and password are required'
            });
        }

        // Find vendor
        const vendor = await Vendor.findOne({ fssaiNumber });
        if (!vendor) {
            return res.status(401).json({
                success: false,
                error: 'Invalid FSSAI number or password'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid FSSAI number or password'
            });
        }

        // Generate token
        const token = generateToken(vendor);

        res.json({
            success: true,
            token,
            vendor: {
                id: vendor._id,
                fssaiNumber: vendor.fssaiNumber,
                name: vendor.name,
                storeName: vendor.storeName,
                altStoreName: vendor.altStoreName,
                isLocationSet: vendor.isLocationSet,
                district: vendor.district,
                profilePhoto: vendor.profilePhoto
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during login'
        });
    }
});

export default router;
