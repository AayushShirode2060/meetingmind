// ============================================================
// MEETING SERVICE (Frontend API Client)
// Centralized HTTP calls for meeting operations
// ============================================================
// WHY a service layer?
// - Components stay clean — they call functions, not raw HTTP
// - API URL changes only need updating here (via VITE_API_URL)
// - Upload progress tracking is configured once
// - Error handling can be standardized here
// ============================================================
import axios from 'axios';
// Create an axios instance with the base URL from environment variables
// In development: http://localhost:5000/api (proxied through Vite)
// In production: https://your-backend.render.com/api
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});
/**
 * Upload an audio file to the server.
 * 
 * @param {FormData} formData - FormData containing the 'audio' file
 * @param {Function} onProgress - Callback receiving upload percentage (0-100)
 * @returns {Promise} Axios response with { success, data: meeting }
 * 
 * WHY FormData? 
 * File uploads require multipart/form-data encoding (not JSON).
 * The browser handles encoding when you pass a FormData object.
 * 
 * WHY onUploadProgress?
 * Shows a progress bar in the UI. Axios fires this callback
 * with the upload progress event, which we convert to a percentage.
 */
export const uploadAudio = (formData, onProgress) => {
  return API.post('/meetings/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      // Calculate percentage: (bytes uploaded / total bytes) * 100
      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      if (onProgress) onProgress(percent);
    }
  });
};
/**
 * Trigger the transcription + summarization pipeline for a meeting.
 * This is a long-running request (30s - 5min).
 * 
 * @param {string} id - Meeting MongoDB ObjectId
 * @returns {Promise} Axios response with { success, data: processedMeeting }
 */
export const summarizeMeeting = (id) => {
  return API.post(`/meetings/${id}/summarize`);
};
/**
 * Get all meetings (for the History page list view).
 * Returns lightweight data (no transcript/summary).
 * 
 * @returns {Promise} Axios response with { success, count, data: meetings[] }
 */
export const getAllMeetings = () => {
  return API.get('/meetings');
};
/**
 * Get a single meeting with ALL data.
 * Used by the Meeting detail page.
 * 
 * @param {string} id - Meeting MongoDB ObjectId
 * @returns {Promise} Axios response with { success, data: meeting }
 */
export const getMeetingById = (id) => {
  return API.get(`/meetings/${id}`);
};
/**
 * Delete a meeting and its associated files.
 * 
 * @param {string} id - Meeting MongoDB ObjectId
 * @returns {Promise} Axios response with { success, message }
 */
export const deleteMeeting = (id) => {
  return API.delete(`/meetings/${id}`);
};
/**
 * Download the PDF report for a meeting.
 * 
 * @param {string} id - Meeting MongoDB ObjectId
 * @returns {Promise} Axios response with the PDF as a Blob
 * 
 * WHY responseType: 'blob'?
 * PDFs are binary data. By default, axios tries to parse responses
 * as JSON, which would corrupt the PDF. 'blob' tells axios to keep
 * the raw binary data, which we can then save as a file.
 */
export const downloadPDF = (id) => {
  return API.get(`/meetings/${id}/pdf`, {
    responseType: 'blob'
  });
};