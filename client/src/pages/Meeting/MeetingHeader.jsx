// ============================================================
// MEETING HEADER
// Title, metadata badges, and action buttons
// ============================================================
// DISPLAYS:
//   - Meeting title (editable in future, for now read-only)
//   - Date created (formatted)
//   - Status badge (color-coded: uploaded/transcribing/completed/failed)
//   - Speaker count and duration (if available)
//   - Action buttons: Download PDF, Chat with Meeting
// ============================================================

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineDocumentArrowDown,
  HiOutlineChatBubbleLeftRight,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineCalendarDays
} from 'react-icons/hi2';
import { downloadPDF } from '../../services/meetingService';

// ---- Status badge color mapping ----
// Maps each meeting status to a color scheme for the badge.
// Using semantic colors: green = success, yellow = in-progress, red = failed
const statusStyles = {
  uploaded: 'bg-blue-400/10 text-blue-400',
  transcribing: 'bg-yellow-400/10 text-yellow-400',
  summarizing: 'bg-purple-400/10 text-purple-400',
  completed: 'bg-emerald-400/10 text-emerald-400',
  failed: 'bg-red-400/10 text-red-400'
};

const MeetingHeader = ({ meeting }) => {
  const navigate = useNavigate();

  /**
   * Format seconds into "Xm Ys" human-readable string.
   * @param {number} seconds - Duration in seconds
   * @returns {string} e.g., "5m 30s"
   */
  const formatDuration = (seconds) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  /**
   * Format ISO date to readable string.
   * @param {string} dateStr - ISO date string
   * @returns {string} e.g., "Jul 11, 2026"
   */
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  /**
   * Download the PDF report for this meeting.
   * 
   * HOW IT WORKS:
   * 1. Fetch the PDF as a binary blob from the server
   * 2. Create a temporary URL from the blob
   * 3. Create a hidden <a> tag and click it to trigger download
   * 4. Clean up the temporary URL
   */
  const handleDownloadPDF = async () => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf' });

      const response = await downloadPDF(meeting._id);

      // Create a blob URL from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link and click it to download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${meeting.title.replace(/\s+/g, '_')}_report.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('PDF downloaded!', { id: 'pdf' });
    } catch (error) {
      toast.error('Failed to download PDF', { id: 'pdf' });
    }
  };

  return (
    <motion.div
      className="glass p-6 sm:p-8 rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top row: Title + Status */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
            {meeting.title}
          </h1>

          {/* Metadata badges row */}
          <div className="flex flex-wrap items-center gap-3 text-text-secondary text-sm">
            {/* Date */}
            <div className="flex items-center gap-1.5">
              <HiOutlineCalendarDays className="text-base" />
              <span>{formatDate(meeting.createdAt)}</span>
            </div>

            {/* Speaker count */}
            {meeting.speakerCount && (
              <>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1.5">
                  <HiOutlineUserGroup className="text-base" />
                  <span>{meeting.speakerCount} speaker{meeting.speakerCount !== 1 ? 's' : ''}</span>
                </div>
              </>
            )}

            {/* Duration */}
            {meeting.duration && (
              <>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1.5">
                  <HiOutlineClock className="text-base" />
                  <span>{formatDuration(meeting.duration)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status badge */}
        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide
                         ${statusStyles[meeting.status] || statusStyles.uploaded}`}>
          {meeting.status}
        </span>
      </div>

      {/* Action buttons */}
      {meeting.status === 'completed' && (
        <div className="flex flex-wrap gap-3">
          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-light 
                       text-white rounded-xl font-medium text-sm transition-all duration-300
                       hover:shadow-lg hover:shadow-accent/25"
          >
            <HiOutlineDocumentArrowDown className="text-lg" />
            Download PDF
          </button>

          {/* Chat with Meeting */}
          <button
            onClick={() => navigate(`/chat/${meeting._id}`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-bg-card hover:bg-bg-card-hover 
                       text-text-primary rounded-xl font-medium text-sm transition-all duration-300
                       border border-border hover:border-accent/30"
          >
            <HiOutlineChatBubbleLeftRight className="text-lg" />
            Chat with Meeting
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default MeetingHeader;
