// ============================================================
// MEETING CONTROLLER
// Handles HTTP requests for meeting CRUD and processing
// ============================================================
// PATTERN: Each function follows this structure:
//   1. Extract data from request (params, body, file)
//   2. Validate input
//   3. Call the appropriate service
//   4. Send JSON response
//   5. Catch errors and pass to error handler via next(error)
// ============================================================
const path = require('path');
const fs = require('fs');
const Meeting = require('../models/Meeting');
const transcriptionService = require('../services/transcriptionService');
const summaryService = require('../services/summaryService');
const pdfService = require('../services/pdfService');
const { generateTitleFromFileName } = require('../utils/helpers');
const { MEETING_STATUS } = require('../utils/constants');
/**
 * POST /api/meetings/upload
 * Upload an audio file and create a new meeting record.
 * 
 * The audio file is handled by multer middleware (in the route),
 * so by the time this controller runs, the file is already saved to disk.
 * We just need to create the database record.
 */
const uploadMeeting = async (req, res, next) => {
  try {
    // multer attaches the file info to req.file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No audio file provided. Please upload an MP3, WAV, or M4A file.'
      });
    }
    // Generate a clean title from the filename
    // e.g., "2024-meeting_notes.mp3" → "Meeting Notes"
    const title = req.body.title || generateTitleFromFileName(req.file.originalname);
    // Create the meeting record in MongoDB
    const meeting = await Meeting.create({
      title,
      originalFileName: req.file.originalname,
      audioUrl: req.file.path,    // Absolute path to saved file on disk
      status: MEETING_STATUS.UPLOADED
    });
    res.status(201).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    next(error);  // Pass to global error handler
  }
};
/**
 * POST /api/meetings/:id/summarize
 * Triggers the full processing pipeline: Transcribe → Summarize
 * 
 * This is the main orchestration endpoint. It:
 *   1. Finds the meeting
 *   2. Calls transcription service (AssemblyAI)
 *   3. Saves transcript
 *   4. Calls summary service (Gemini)
 *   5. Saves all extracted insights
 * 
 * Each step updates the meeting status so the frontend can show progress.
 */
const summarizeMeeting = async (req, res, next) => {
  let meeting;
  try {
    // ---- Find the meeting ----
    meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }
    // ---- PHASE 1: TRANSCRIPTION ----
    meeting.status = MEETING_STATUS.TRANSCRIBING;
    await meeting.save();
    // Call AssemblyAI to transcribe the audio file
    // This is the slowest step — can take 30s to several minutes
    const transcriptData = await transcriptionService.transcribe(meeting.audioUrl);
    // Save transcript data to the meeting document
    meeting.transcript = {
      raw: transcriptData.raw,
      utterances: transcriptData.utterances
    };
    meeting.duration = transcriptData.duration;
    meeting.speakerCount = transcriptData.speakerCount;
    // ---- PHASE 2: SUMMARIZATION ----
    meeting.status = MEETING_STATUS.SUMMARIZING;
    await meeting.save();
    // Call Gemini to analyze the transcript
    const summaryData = await summaryService.summarize(transcriptData.raw);
    // Save all extracted insights
    meeting.summary = summaryData.summary;
    meeting.keyDecisions = summaryData.keyDecisions;
    meeting.actionItems = summaryData.actionItems;
    meeting.deadlines = summaryData.deadlines;
    meeting.risks = summaryData.risks;
    meeting.followUpEmail = summaryData.followUpEmail;
    // ---- DONE ----
    meeting.status = MEETING_STATUS.COMPLETED;
    await meeting.save();
    res.json({
      success: true,
      data: meeting
    });
  } catch (error) {
    // If anything fails, mark the meeting as failed with the error message
    // This lets the frontend show a "failed" state with a retry option
    if (meeting) {
      meeting.status = MEETING_STATUS.FAILED;
      meeting.error = error.message;
      await meeting.save();
    }
    next(error);
  }
};
/**
 * GET /api/meetings
 * Get all meetings, sorted by most recent first.
 * 
 * Uses .select() to return only the fields needed for the list view
 * (not the full transcript/summary — those are heavy and unnecessary for a list).
 */
const getAllMeetings = async (req, res, next) => {
  try {
    const meetings = await Meeting.find()
      .select('title status createdAt duration speakerCount originalFileName')
      .sort({ createdAt: -1 }); // Most recent first
    res.json({
      success: true,
      count: meetings.length,
      data: meetings
    });
  } catch (error) {
    next(error);
  }
};
/**
 * GET /api/meetings/:id
 * Get a single meeting with ALL data (transcript, summary, everything).
 * Used by the Meeting detail page.
 */
const getMeetingById = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }
    res.json({
      success: true,
      data: meeting
    });
  } catch (error) {
    next(error);
  }
};
/**
 * DELETE /api/meetings/:id
 * Delete a meeting and clean up associated files (audio + PDF report).
 * 
 * Important: We also delete the physical files from disk
 * to prevent storage leaks.
 */
const deleteMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }
    // ---- Clean up audio file from disk ----
    if (meeting.audioUrl && fs.existsSync(meeting.audioUrl)) {
      fs.unlinkSync(meeting.audioUrl);
    }
    // ---- Clean up PDF report if it exists ----
    const reportPath = path.join(__dirname, '..', 'uploads', 'reports', `${meeting._id}-report.pdf`);
    if (fs.existsSync(reportPath)) {
      fs.unlinkSync(reportPath);
    }
    // ---- Delete from database ----
    await Meeting.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Meeting deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
/**
 * GET /api/meetings/:id/pdf
 * Generate and download a PDF report for a meeting.
 * 
 * Flow:
 *   1. Find the meeting (must be completed)
 *   2. Generate the PDF via pdfService
 *   3. Stream the file back to the client as a download
 */
const downloadPDF = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }
    // Only allow PDF generation for completed meetings
    if (meeting.status !== MEETING_STATUS.COMPLETED) {
      return res.status(400).json({
        success: false,
        error: 'Meeting has not been fully processed yet.'
      });
    }
    // Generate the PDF (creates a file on disk)
    const filePath = await pdfService.generatePDF(meeting);
    // Set headers for file download
    // Content-Disposition: attachment → tells the browser to download, not display
    const fileName = `${meeting.title.replace(/[^a-zA-Z0-9]/g, '_')}_Report.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    // Stream the file to the client
    // Using a stream is memory-efficient — the entire file isn't loaded into RAM
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  uploadMeeting,
  summarizeMeeting,
  getAllMeetings,
  getMeetingById,
  deleteMeeting,
  downloadPDF
};