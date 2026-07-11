// ============================================================
// CHAT SERVICE (Frontend API Client)
// Handles AI chat requests with meeting transcripts
// ============================================================
import axios from 'axios';
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});
/**
 * Send a question about a specific meeting to the AI.
 * 
 * @param {string} meetingId - MongoDB ObjectId of the meeting
 * @param {string} question - The user's question
 * @returns {Promise} Axios response with { success, data: { answer } }
 * 
 * The AI will answer strictly from the meeting's transcript.
 * Previous chat messages are stored server-side, so multi-turn
 * conversations work automatically.
 */
export const sendMessage = (meetingId, question) => {
  return API.post(`/chat/${meetingId}`, { question });
};