// ============================================================
// HISTORY PAGE — Orchestrator
// ============================================================
// RESPONSIBILITIES:
//   1. Fetch all meetings on mount
//   2. Render loading state → empty state → card grid
//   3. Handle meeting deletion (optimistic UI)
//
// EMPTY STATE:
//   If no meetings exist, shows a friendly CTA to upload.
//   This avoids a blank, confusing page.
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineCloudArrowUp,
  HiOutlineFolderOpen
} from 'react-icons/hi2';

// Components
import MeetingCard from './MeetingCard';
import Loader from '../../components/Loader/Loader';

// API services
import { getAllMeetings, deleteMeeting } from '../../services/meetingService';

const History = () => {
  const navigate = useNavigate();

  // ---- State ----
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    try {
      const response = await getAllMeetings();
      setMeetings(response.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  // ---- Fetch all meetings on mount ----
  useEffect(() => {
    fetchMeetings();
  }, []);

  /**
   * Delete a meeting by ID.
   * 
   * OPTIMISTIC UI:
   * We remove the card from the grid immediately (before the API responds),
   * then call the API. If the API fails, we re-fetch to restore the correct state.
   * This makes the UI feel instant and responsive.
   */
  const handleDelete = async (id) => {
    // Optimistic: remove from UI immediately
    const previousMeetings = [...meetings];
    setMeetings((prev) => prev.filter((m) => m._id !== id));

    try {
      await deleteMeeting(id);
      toast.success('Meeting deleted');
    } catch (err) {
      console.error(err);
      // Rollback: restore previous state if API fails
      setMeetings(previousMeetings);
      toast.error('Failed to delete meeting');
    }
  };

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader status="Loading meetings..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ---- Page Header ---- */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-1">
            Meeting History
          </h1>
          <p className="text-text-secondary text-sm">
            {meetings.length} meeting{meetings.length !== 1 ? 's' : ''} recorded
          </p>
        </div>

        {/* Upload new meeting button */}
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-light
                     text-white rounded-xl font-medium text-sm transition-all duration-300
                     hover:shadow-lg hover:shadow-accent/25 self-start"
        >
          <HiOutlineCloudArrowUp className="text-lg" />
          New Meeting
        </button>
      </motion.div>

      {/* ---- Content: Empty State or Card Grid ---- */}
      {meetings.length === 0 ? (
        // ---- Empty State ----
        <motion.div
          className="glass p-12 rounded-2xl text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-bg-card flex items-center justify-center mx-auto mb-6">
            <HiOutlineFolderOpen className="text-3xl text-text-muted" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            No meetings yet
          </h2>
          <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto">
            Upload your first meeting audio to get started with AI-powered transcription and summarization.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="px-6 py-3 bg-accent hover:bg-accent-light text-white 
                       rounded-xl font-medium transition-all duration-300
                       hover:shadow-lg hover:shadow-accent/25"
          >
            Upload Meeting
          </button>
        </motion.div>
      ) : (
        // ---- Meeting Cards Grid ----
        // 1 column mobile, 2 tablet, 3 desktop
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {meetings.map((meeting, index) => (
            <MeetingCard
              key={meeting._id}
              meeting={meeting}
              onDelete={handleDelete}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
