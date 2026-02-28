import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/uploadRoutes';
import historyRoutes from './routes/historyRoutes';
import reportRoutes from './routes/reportRoutes';
import { errorHandler } from './middleware/errorHandler';
import { connectDB } from './config/database';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

// Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
connectDB().then(() => {
  console.log('🗄️  Database connection established');
}).catch((error) => {
  console.error('Failed to connect to database:', error);
});

// Routes
app.use('/api', uploadRoutes);
app.use('/api', historyRoutes);
app.use('/api', reportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'Backend is running',
    timestamp: new Date(),
    database: 'connected'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 CSV upload endpoint: POST http://localhost:${PORT}/api/upload`);
  console.log(`✅ CORS enabled for: ${CLIENT_URL}`);
  console.log(`🗄️  MongoDB URI configured`);
});