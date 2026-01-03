import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import vendorRoutes from './routes/vendor.js';
import listingsRoutes from './routes/listings.js';
import pricesRoutes from './routes/prices.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'smartvegis'
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/prices', pricesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'SmartVegis-Vendors API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'SmartVegis-Vendors API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            vendor: '/api/vendor',
            listings: '/api/listings',
            prices: '/api/prices',
            health: '/api/health'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Start server
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`
╔═══════════════════════════════════════════════════╗
║        SmartVegis-Vendors API Server              ║
╠═══════════════════════════════════════════════════╣
║  🚀 Server running on port ${PORT}                   ║
║  📡 API: http://localhost:${PORT}/api               ║
║  🏥 Health: http://localhost:${PORT}/api/health     ║
╚═══════════════════════════════════════════════════╝
    `);
    });
};

startServer();
