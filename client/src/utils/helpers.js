// ============================================================
// CLIENT-SIDE HELPER UTILITIES
// Shared formatting and utility functions
// ============================================================

/**
 * Format duration in seconds to a human-readable string.
 * Used in meeting cards and the meeting detail page.
 * 
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted string, e.g., "5m 30s" or "1h 2m"
 * 
 * Examples:
 *   formatDuration(90)   → "1m 30s"
 *   formatDuration(3661) → "1h 1m 1s"
 *   formatDuration(0)    → "0s"
 */
export const formatDuration = (seconds) => {
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
 * Format a date string or Date object to a readable format.
 * Used in meeting cards and the history page.
 * 
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date, e.g., "Jul 10, 2026"
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format a date to include time.
 * @param {string|Date} date
 * @returns {string} e.g., "Jul 10, 2026 at 2:30 PM"
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Copy text to the user's clipboard.
 * Uses the modern Clipboard API (falls back for older browsers).
 * 
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} True if copy succeeded
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for browsers that don't support clipboard API
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
};

/**
 * Trigger a file download from a Blob.
 * Used by the PDF export feature.
 * 
 * HOW IT WORKS:
 * 1. Create a temporary URL pointing to the Blob data
 * 2. Create an invisible <a> element with that URL
 * 3. Programmatically click it to trigger the download
 * 4. Clean up the temporary URL and element
 * 
 * @param {Blob} blob - The file data
 * @param {string} fileName - The name for the downloaded file
 */
export const downloadBlob = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  // Clean up — revoke the URL to free memory
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

/**
 * Get a color for a meeting status badge.
 * Maps status strings to Tailwind color classes.
 * 
 * @param {string} status - Meeting status
 * @returns {Object} { bg, text } CSS classes
 */
export const getStatusColor = (status) => {
  const colors = {
    uploaded: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    transcribing: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    summarizing: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
    completed: { bg: 'bg-green-500/20', text: 'text-green-400' },
    failed: { bg: 'bg-red-500/20', text: 'text-red-400' }
  };
  return colors[status] || colors.uploaded;
};
