import jwt from 'jsonwebtoken';

/**
 * JWT Authentication Middleware
 */
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access token required'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.vendor = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
}

/**
 * Generate JWT Token
 */
export function generateToken(vendor) {
    return jwt.sign(
        {
            id: vendor._id,
            fssaiNumber: vendor.fssaiNumber,
            name: vendor.name
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
}

export default { authenticateToken, generateToken };
