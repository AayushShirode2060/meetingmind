// ============================================================
// CHAT HEADER
// Meeting title, back navigation, message count
// ============================================================

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineArrowLeft,
  HiOutlineChatBubbleLeftRight
} from 'react-icons/hi2';

/**
 * @param {Object} props
 * @param {Object} props.meeting - Meeting object with title, _id
 * @param {number} props.messageCount - Number of messages in the chat
 */
const ChatHeader = ({ meeting, messageCount }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="glass p-4 sm:p-5 rounded-2xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        {/* Left: Back button + title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Back to meeting detail */}
          <button
            onClick={() => navigate(`/meeting/${meeting._id}`)}
            className="p-2 rounded-xl hover:bg-bg-card-hover text-text-secondary 
                       hover:text-text-primary transition-all duration-200 flex-shrink-0"
            title="Back to meeting"
          >
            <HiOutlineArrowLeft className="text-lg" />
          </button>

          {/* Meeting title (truncated if too long) */}
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-text-primary truncate">
              {meeting.title}
            </h1>
            <p className="text-text-muted text-xs">
              {messageCount > 0 
                ? `${messageCount} message${messageCount !== 1 ? 's' : ''}`
                : 'Ask anything about this meeting'
              }
            </p>
          </div>
        </div>

        {/* Right: Chat icon */}
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
          <HiOutlineChatBubbleLeftRight className="text-xl text-accent" />
        </div>
      </div>
    </motion.div>
  );
};

export default ChatHeader;
