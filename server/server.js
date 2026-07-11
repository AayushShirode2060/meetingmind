/**
 * Fix for MongoDB Atlas SRV DNS resolution.
 * Some ISP/local DNS servers fail to resolve mongodb+srv records.
 */
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');
// Initialize Express
const app = express();
// Connect to MongoDB
connectDB();
// ===== MIDDLEWARE =====
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// Serve uploaded files statically (needed for audio playback later)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// ===== ROUTES =====
// These will be created in Phase 2. For now, add a health check:
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MeetingMind AI server is running 🧠',
    timestamp: new Date().toISOString()
  });
});

// Mount route modules
// All meeting routes will be prefixed with /api/meetings
// All chat routes will be prefixed with /api/chat
const meetingRoutes = require('./routes/meetingRoutes');
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/meetings', meetingRoutes);
app.use('/api/chat', chatRoutes);
// ===== ERROR HANDLER (must be last) =====
app.use(errorHandler);
// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🧠 MeetingMind AI Server`);
  console.log(`📡 Running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});