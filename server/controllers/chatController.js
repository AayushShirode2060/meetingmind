// ============================================================
// CHAT CONTROLLER
// Handles HTTP requests for AI chat over meeting transcripts
// ============================================================
const chatService = require('../services/chatService');
/**
 * POST /api/chat/:id
 * Send a question about a specific meeting to the AI.
 * 
 * Request body: { question: "Who owns the deployment task?" }
 * Response:     { success: true, data: { answer: "Based on the meeting..." } }
 */
const chatWithMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question } = req.body;
    // ---- Validate input ----
    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a question.'
      });
    }
    // ---- Delegate to chat service ----
    // The service handles: fetching meeting, building prompt,
    // calling Gemini, saving chat history
    const result = await chatService.chat(id, question.trim());
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  chatWithMeeting
};