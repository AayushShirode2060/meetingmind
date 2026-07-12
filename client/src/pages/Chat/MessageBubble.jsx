// ============================================================
// MESSAGE BUBBLE
// Individual chat message (user or assistant)
// ============================================================
// VISUAL STATES:
//   - User message: right-aligned, accent background
//   - Assistant message: left-aligned, card background
//   - Typing indicator: pulsing dots animation
// ============================================================

import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineSparkles } from 'react-icons/hi2';

/**
 * @param {Object} props
 * @param {string} props.role - 'user' or 'assistant'
 * @param {string} props.content - Message text
 * @param {boolean} [props.isTyping] - Show typing indicator instead of content
 */
const MessageBubble = ({ role, content, isTyping = false }) => {
  const isUser = role === 'user';

  return (
    <motion.div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                       ${isUser ? 'bg-accent/20' : 'bg-bg-card border border-border'}`}>
        {isUser 
          ? <HiOutlineUser className="text-sm text-accent" />
          : <HiOutlineSparkles className="text-sm text-accent" />
        }
      </div>

      {/* Message bubble */}
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                       ${isUser
                         ? 'bg-accent/15 text-text-primary rounded-tr-sm'
                         : 'bg-bg-card border border-border text-text-secondary rounded-tl-sm'
                       }`}>
        {isTyping ? (
          // ---- Typing indicator: 3 pulsing dots ----
          <div className="flex items-center gap-1.5 py-1 px-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 rounded-full bg-accent/60"
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15  // Stagger each dot
                }}
              />
            ))}
          </div>
        ) : (
          // ---- Message content ----
          // whitespace-pre-line preserves line breaks from the AI response
          <p className="whitespace-pre-line">{content}</p>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
