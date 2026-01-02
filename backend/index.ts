import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './src/config/database.js';
import authRoutes from './src/routes/authRoutes.js';
import { errorHandler, notFound } from './src/middleware/errorHandler.js';

// Load environment variables FIRST, before any other imports that might use them
dotenv.config();

// Debug: Log if env vars are loaded (without showing values)
console.log('📋 Environment variables loaded:');
console.log(`   GMAIL_USER: ${process.env.GMAIL_USER ? '✅ Set' : '❌ Not set'}`);
console.log(`   GMAIL_APP_PASSWORD: ${process.env.GMAIL_APP_PASSWORD ? '✅ Set' : '❌ Not set'}`);
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Not set'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Not set'}`);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
