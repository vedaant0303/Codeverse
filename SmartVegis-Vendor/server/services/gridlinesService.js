import axios from 'axios';

/**
 * Gridlines FSSAI Verification Service
 * Verifies FSSAI license numbers and retrieves business details
 */

const GRIDLINES_API_URL = process.env.GRIDLINES_API_URL || 'https://api.gridlines.io/fssai-api/fetch-license';

/**
 * Verify FSSAI license number using Gridlines API
 * @param {string} fssaiNumber - 14-digit FSSAI license number
 * @returns {Object} - Verification result with business details
 */
export async function verifyFSSAILicense(fssaiNumber) {
    const apiKey = process.env.GRIDLINES_API_KEY;

    if (!apiKey || apiKey === 'your_gridlines_api_key_here') {
        // Development mode - return mock data
        console.log('⚠️ Gridlines API key not configured. Using mock verification.');
        return getMockFSSAIData(fssaiNumber);
    }

    try {
        const response = await axios.post(
            GRIDLINES_API_URL,
            {
                license_number: fssaiNumber,
                consent: 'Y'
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': apiKey,
                    'X-Auth-Type': 'API-Key'
                }
            }
        );

        console.log('✅ Gridlines API Response:', JSON.stringify(response.data, null, 2));

        if (response.data && response.data.data) {
            const data = response.data.data;
            console.log('📦 FSSAI Data:', JSON.stringify(data, null, 2));

            return {
                success: true,
                verified: true,
                data: {
                    licenseNumber: data.license_number || data.fssai_no || fssaiNumber,
                    companyName: data.name || data.company_name || data.premise_name || data.firm_name || 'Vendor Store',
                    address: data.address || data.premise_address || data.full_address || '',
                    state: data.state || 'Maharashtra',
                    district: data.district || '',
                    pincode: data.pincode || '',
                    licenseType: data.license_type || data.license_category || 'FSSAI',
                    status: data.status || data.license_status || 'Active',
                    expiryDate: data.expiry_date || data.valid_upto ? new Date(data.expiry_date || data.valid_upto) : null,
                    issuedDate: data.issued_date || data.valid_from ? new Date(data.issued_date || data.valid_from) : null,
                    products: data.products || data.product_list || []
                }
            };
        }

        return {
            success: false,
            verified: false,
            error: 'Invalid response from FSSAI verification'
        };

    } catch (error) {
        console.error('FSSAI Verification Error:', error.response?.data || error.message);

        // If API fails in development, use mock data
        if (process.env.NODE_ENV !== 'production') {
            console.log('⚠️ Using mock data due to API error');
            return getMockFSSAIData(fssaiNumber);
        }

        return {
            success: false,
            verified: false,
            error: error.response?.data?.message || 'FSSAI verification failed'
        };
    }
}

/**
 * Mock FSSAI data for development/testing
 */
function getMockFSSAIData(fssaiNumber) {
    // Validate format (14 digits)
    if (!/^\d{14}$/.test(fssaiNumber)) {
        return {
            success: false,
            verified: false,
            error: 'Invalid FSSAI number format. Must be 14 digits.'
        };
    }

    // Mock data for testing
    return {
        success: true,
        verified: true,
        isMock: true,
        data: {
            licenseNumber: fssaiNumber,
            companyName: `Vendor Store ${fssaiNumber.slice(-4)}`,
            address: 'Market Area, Maharashtra',
            state: 'Maharashtra',
            district: 'Pune',
            pincode: '411001',
            licenseType: 'FSSAI Registration',
            status: 'Active',
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
            issuedDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
            products: ['Vegetables', 'Fruits']
        }
    };
}

export default { verifyFSSAILicense };
