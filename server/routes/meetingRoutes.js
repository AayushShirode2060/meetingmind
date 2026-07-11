// ============================================================
// MEETING ROUTES
// Defines REST API endpoints for meeting operations
// ============================================================
// ROUTE MAP:
//   POST   /api/meetings/upload        → Upload audio file
//   POST   /api/meetings/:id/summarize → Trigger AI processing
//   GET    /api/meetings               → List all meetings
//   GET    /api/meetings/:id           → Get single meeting
//   DELETE /api/meetings/:id           → Delete meeting
//   GET    /api/meetings/:id/pdf       → Download PDF report
// ============================================================
const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const upload = require('../middlewares/uploadMiddleware');
// Upload audio file
// upload.single('audio') → multer middleware that:
//   1. Reads the multipart form data
//   2. Validates file type and size
//   3. Saves file to uploads/audio/
//   4. Attaches file info to req.file
// 'audio' is the form field name the frontend will use
router.post('/upload', upload.single('audio'), meetingController.uploadMeeting);
// Trigger transcription + summarization pipeline
router.post('/:id/summarize', meetingController.summarizeMeeting);
// Get all meetings (for history page)
router.get('/', meetingController.getAllMeetings);
// Get single meeting (for meeting detail page)
router.get('/:id', meetingController.getMeetingById);
// Delete a meeting
router.delete('/:id', meetingController.deleteMeeting);
// Download PDF report
router.get('/:id/pdf', meetingController.downloadPDF);
module.exports = router;