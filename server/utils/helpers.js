const path = require('path');
/**
 * Format duration in seconds to human-readable string
 * @param {number} seconds
 * @returns {string} e.g., "5m 30s" or "1h 2m 15s"
 */
const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return '0s';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const parts = [];
  if (hrs > 0) parts.push(`${hrs}h`);
  if (mins > 0) parts.push(`${mins}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  return parts.join(' ');
};
/**
 * Generate a clean meeting title from a filename
 * @param {string} filename - Original file name
 * @returns {string} Clean title
 */
const generateTitleFromFileName = (filename) => {
  // Remove extension
  const name = path.basename(filename, path.extname(filename));
  // Replace common separators with spaces
  const cleaned = name
    .replace(/[-_]/g, ' ')        // hyphens/underscores → spaces
    .replace(/\d{13,}/g, '')      // remove timestamps (13+ digit numbers)
    .replace(/\s+/g, ' ')         // collapse whitespace
    .trim();
  if (!cleaned) return 'Untitled Meeting';
  // Capitalize first letter of each word
  return cleaned
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
/**
 * Get file extension in lowercase
 * @param {string} filename
 * @returns {string} e.g., ".mp3"
 */
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};
module.exports = {
  formatDuration,
  generateTitleFromFileName,
  getFileExtension
};