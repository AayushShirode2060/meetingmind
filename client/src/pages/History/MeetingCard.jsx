// ============================================================
// MEETING CARD
// Individual card for the history grid
// ============================================================
// DISPLAYS:
//   - Meeting title
//   - Creation date
//   - Status badge (color-coded)
//   - Speaker count & duration (if available)
//   - Delete button (with confirmation)
//
// INTERACTIONS:
//   - Click card → navigate to meeting detail
//   - Click delete → confirmation → delete + remove from list
// ============================================================

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineTrash,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineChevronRight
} from 'react-icons/hi2';

// Status badge color mapping (same as MeetingHeader)
const statusStyles = {
  uploaded: 'bg-blue-400/10 text-blue-400',
  transcribing: 'bg-yellow-400/10 text-yellow-400',
  summarizing: 'bg-purple-400/10 text-purple-400',
  completed: 'bg-emerald-400/10 text-emerald-400',
  failed: 'bg-red-400/10 text-red-400'
};

const MeetingCard = ({ meeting, onDelete, index = 0 }) => {
  const navigate = useNavigate();

  /** Format date to readable string */
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  /** Format seconds to "Xm Ys" */
  const formatDuration = (seconds) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  /**
   * Handle delete with confirmation.
   * Stops event propagation so the card click doesn't also fire.
   */
  const handleDelete = (e) => {
    e.stopPropagation(); // Don't navigate when clicking delete
    if (window.confirm(`Delete "${meeting.title}"? This cannot be undone.`)) {
      onDelete(meeting._id);
    }
  };

  return (
    <motion.div
      className="glass p-5 rounded-2xl cursor-pointer group
                 hover:bg-bg-card-hover transition-all duration-300
                 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5"
      onClick={() => navigate(`/meeting/${meeting._id}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {/* Top row: Status badge + Delete button */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide
                         ${statusStyles[meeting.status] || statusStyles.uploaded}`}>
          {meeting.status}
        </span>

        {/* Delete button — visible on hover */}
        <button
          onClick={handleDelete}
          className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10
                     opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="Delete meeting"
        >
          <HiOutlineTrash className="text-base" />
        </button>
      </div>

      {/* Meeting title */}
      <h3 className="text-text-primary font-semibold text-base mb-2 line-clamp-2
                     group-hover:text-accent transition-colors duration-200">
        {meeting.title}
      </h3>

      {/* Date */}
      <p className="text-text-muted text-xs mb-3">
        {formatDate(meeting.createdAt)}
      </p>

      {/* Bottom row: metadata + arrow */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-text-muted text-xs">
          {/* Speaker count */}
          {meeting.speakerCount && (
            <div className="flex items-center gap-1">
              <HiOutlineUserGroup className="text-sm" />
              <span>{meeting.speakerCount}</span>
            </div>
          )}

          {/* Duration */}
          {meeting.duration && (
            <div className="flex items-center gap-1">
              <HiOutlineClock className="text-sm" />
              <span>{formatDuration(meeting.duration)}</span>
            </div>
          )}
        </div>

        {/* Arrow indicator — shows on hover */}
        <HiOutlineChevronRight
          className="text-text-muted group-hover:text-accent 
                     group-hover:translate-x-1 transition-all duration-200"
        />
      </div>
    </motion.div>
  );
};

export default MeetingCard;
