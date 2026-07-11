// ============================================================
// MEETING DETAIL PAGE — Orchestrator
// ============================================================
// RESPONSIBILITIES:
//   1. Fetch meeting data by ID from the URL params
//   2. Show loading spinner while fetching
//   3. Show error state if fetch fails
//   4. Compose all section components with the fetched data
//
// DATA FLOW:
//   URL param (:id) → API call → meeting state → passed as props to children
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineSparkles,
  HiOutlineLightBulb,
  HiOutlineExclamationTriangle,
  HiOutlineCalendarDays,
  HiOutlineEnvelope,
  HiOutlineArrowLeft
} from 'react-icons/hi2';

// Page-specific components (colocated in the same directory)
import MeetingHeader from './MeetingHeader';
import SummaryCard from './SummaryCard';
import ActionItemsTable from './ActionItemsTable';
import InsightsList from './InsightsList';
import TranscriptViewer from './TranscriptViewer';

// Shared components
import Loader from '../../components/Loader/Loader';

// API service
import { getMeetingById } from '../../services/meetingService';

const MeetingDetail = () => {
  // ---- Get meeting ID from URL ----
  // URL: /meeting/:id  →  useParams() returns { id: '...' }
  const { id } = useParams();
  const navigate = useNavigate();

  // ---- State ----
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---- Fetch meeting data on mount ----
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        setLoading(true);
        const response = await getMeetingById(id);
        setMeeting(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load meeting');
        toast.error('Failed to load meeting');
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [id]); // Re-fetch if the URL id changes

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader status="Loading meeting details..." />
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
          <h2 className="text-xl font-bold text-text-primary mb-2">Meeting Not Found</h2>
          <p className="text-text-secondary text-sm mb-6">{error || 'This meeting does not exist.'}</p>
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

  // ---- Render meeting details ----
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <motion.button
        onClick={() => navigate('/history')}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary 
                   text-sm mb-6 transition-colors duration-200"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <HiOutlineArrowLeft />
        Back to History
      </motion.button>

      {/* 
        All sections are stacked vertically with consistent spacing.
        Each section manages its own "empty" state — if no data, it returns null.
        The `delay` prop staggers the entrance animations for visual flow.
      */}
      <div className="space-y-6">
        {/* Header: title, metadata, action buttons */}
        <MeetingHeader meeting={meeting} />

        {/* Executive Summary */}
        <SummaryCard
          title="Executive Summary"
          icon={HiOutlineSparkles}
          content={meeting.summary}
          delay={0.1}
        />

        {/* Key Decisions */}
        <InsightsList
          title="Key Decisions"
          icon={HiOutlineLightBulb}
          items={meeting.keyDecisions}
          iconColor="text-amber-400"
          iconBg="bg-amber-400/10"
          delay={0.15}
        />

        {/* Action Items Table */}
        <ActionItemsTable
          items={meeting.actionItems}
          delay={0.2}
        />

        {/* Deadlines */}
        <InsightsList
          title="Deadlines"
          icon={HiOutlineCalendarDays}
          items={meeting.deadlines}
          iconColor="text-red-400"
          iconBg="bg-red-400/10"
          isDeadline={true}
          delay={0.25}
        />

        {/* Risks */}
        <InsightsList
          title="Risks & Concerns"
          icon={HiOutlineExclamationTriangle}
          items={meeting.risks}
          iconColor="text-orange-400"
          iconBg="bg-orange-400/10"
          delay={0.3}
        />

        {/* Follow-up Email */}
        <SummaryCard
          title="Follow-up Email Draft"
          icon={HiOutlineEnvelope}
          content={meeting.followUpEmail}
          iconColor="text-purple-400"
          delay={0.35}
        />

        {/* Transcript (collapsed by default) */}
        <TranscriptViewer
          transcript={meeting.transcript}
          delay={0.4}
        />
      </div>
    </div>
  );
};

export default MeetingDetail;
