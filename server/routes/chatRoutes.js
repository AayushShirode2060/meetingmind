// ============================================================
// CHAT ROUTES
// Defines the API endpoint for AI chat with meetings
// ============================================================
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
// POST /api/chat/:id → Ask a question about a meeting
// :id is the MongoDB ObjectId of the meeting
router.post('/:id', chatController.chatWithMeeting);
module.exports = router;