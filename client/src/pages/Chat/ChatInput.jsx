// ============================================================
// CHAT INPUT
// Message input field with send button
// ============================================================
// FEATURES:
//   - Enter key sends message (Shift+Enter for new line is standard)
//   - Disabled during AI response (prevents double-sending)
//   - Auto-focus on mount for immediate typing
//   - Send button changes appearance when active vs disabled
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { HiOutlinePaperAirplane } from 'react-icons/hi2';

/**
 * @param {Object} props
 * @param {Function} props.onSend - Called with the message string when user sends
 * @param {boolean} props.disabled - Disable input during AI response
 */
const ChatInput = ({ onSend, disabled = false }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  // Auto-focus the input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Re-focus after AI response completes (disabled goes from true → false)
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  /**
   * Handle form submission.
   * Trims whitespace and clears input after sending.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setInput('');
  };

  /**
   * Handle Enter key press.
   * Enter sends, Shift+Enter adds a new line (textarea behavior).
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-3 sm:p-4 rounded-2xl">
      <div className="flex items-end gap-3">
        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'AI is thinking...' : 'Ask about this meeting...'}
          disabled={disabled}
          className="flex-1 bg-bg-secondary rounded-xl px-4 py-3 text-sm text-text-primary
                     placeholder:text-text-muted border border-border
                     focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25
                     transition-all duration-200 disabled:opacity-50"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className={`p-3 rounded-xl transition-all duration-200 flex-shrink-0
                     ${input.trim() && !disabled
                       ? 'bg-accent hover:bg-accent-light text-white hover:shadow-lg hover:shadow-accent/25'
                       : 'bg-bg-card text-text-muted cursor-not-allowed'
                     }`}
        >
          <HiOutlinePaperAirplane className="text-lg" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
