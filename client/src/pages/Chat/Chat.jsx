// ============================================================
// CHAT PAGE — Orchestrator
// ============================================================
// RESPONSIBILITIES:
//   1. Fetch meeting data (title, chat history) by ID
//   2. Display existing chat history on load
//   3. Handle sending new messages to the AI
//   4. Auto-scroll to the latest message
//
// DATA FLOW:
//   User types → ChatInput → onSend → API call → update messages → auto-scroll
//
// CHAT HISTORY:
//   The server stores chatHistory in the Meeting document.
//   On load, we fetch the meeting and display existing messages.
//   New messages are added locally AND persisted server-side.
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
// Page-specific components
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
// Shared components
import Loader from '../../components/Loader/Loader';
// API services
import { getMeetingById } from '../../services/meetingService';
import { sendMessage } from '../../services/chatService';
const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // ---- State ----
  const [meeting, setMeeting] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);       // Page loading
  const [sending, setSending] = useState(false);       // AI is responding
  const [error, setError] = useState(null);
  // ---- Ref for auto-scrolling ----
  // This ref points to an invisible div at the bottom of the messages list.
  // Calling scrollIntoView() on it scrolls the chat to the bottom.
  const messagesEndRef = useRef(null);
  // ---- Fetch meeting data on mount ----
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await getMeetingById(id);
        const meetingData = response.data.data;
        setMeeting(meetingData);
        // Load existing chat history (if user has chatted before)
        if (meetingData.chatHistory && meetingData.chatHistory.length > 0) {
          setMessages(meetingData.chatHistory);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load meeting');
        toast.error('Failed to load meeting');
      } finally {
        setLoading(false);
      }
    };
    fetchMeeting();
  }, [id]);
  // ---- Auto-scroll when messages change ----
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, sending]);
  /**
   * Send a message to the AI.
   * 
   * FLOW:
   * 1. Add user message to local state (instant feedback)
   * 2. Set sending=true (shows typing indicator)
   * 3. Call API with the question
   * 4. Add AI response to local state
   * 5. Set sending=false (hides typing indicator)
   */
  const handleSend = async (question) => {
    // 1. Add user message immediately
    const userMessage = { role: 'user', content: question };
    setMessages((prev) => [...prev, userMessage]);
    // 2. Show typing indicator
    setSending(true);
    try {
      // 3. Call the chat API
      const response = await sendMessage(id, question);
      const answer = response.data.data.answer;
      // 4. Add AI response
      const assistantMessage = { role: 'assistant', content: answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to get AI response');
      // Add error message as assistant response so user sees what happened
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your question. Please try again.'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // 5. Hide typing indicator
      setSending(false);
    }
  };
  // ---- Loading state ----
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader status="Loading chat..." />
      </div>
    );
  }
  // ---- Error state ----
  if (error || !meeting) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          className="glass p-8 rounded-2xl text-center max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <HiOutlineExclamationTriangle className="text-4xl text-danger mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">Chat Unavailable</h2>
          <p className="text-text-secondary text-sm mb-6">
            {error || 'Could not load this meeting.'}
          </p>
          <button
            onClick={() => navigate('/history')}
            className="px-6 py-3 bg-accent hover:bg-accent-light text-white 
                       rounded-xl font-medium transition-all duration-300"
          >
            View All Meetings
          </button>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-5rem)]">
      {/* Header: meeting title + back button */}
      <ChatHeader meeting={meeting} messageCount={messages.length} />
      {/* ---- Messages Area ---- */}
      {/* flex-1 makes this grow to fill available space */}
      {/* overflow-y-auto enables scrolling when messages overflow */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {/* Empty state — no messages yet */}
        {messages.length === 0 && !sending && (
          <motion.div
            className="flex flex-col items-center justify-center h-full text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Chat with your meeting
            </h3>
            <p className="text-text-secondary text-sm max-w-sm">
              Ask any question about this meeting. The AI will answer based on the transcript.
            </p>
            {/* Suggested questions */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {[
                'What were the key decisions?',
                'Summarize the action items',
                'What risks were discussed?'
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="px-4 py-2 rounded-xl bg-bg-card border border-border
                             text-text-secondary text-xs hover:border-accent/30
                             hover:text-text-primary transition-all duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        {/* Message bubbles */}
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            role={msg.role}
            content={msg.content}
          />
        ))}
        {/* Typing indicator — shown while AI is responding */}
        {sending && (
          <MessageBubble role="assistant" content="" isTyping={true} />
        )}
        {/* Invisible scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
      {/* ---- Input Area (pinned to bottom) ---- */}
      <ChatInput onSend={handleSend} disabled={sending} />
    </div>
  );
};
export default Chat;