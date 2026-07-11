// ============================================================
// TRANSCRIPT VIEWER
// Expandable/collapsible transcript with speaker labels
// ============================================================
// FEATURES:
//   - Toggle expand/collapse with smooth animation
//   - Speaker labels with color-coded badges
//   - Raw text fallback when utterances aren't available
//   - Shows utterance count in header
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineDocumentText,
  HiOutlineChevronDown
} from 'react-icons/hi2';

// ---- Speaker color palette ----
// Cycles through these colors for different speakers.
// 6 colors should cover most meetings.
const SPEAKER_COLORS = [
  'bg-blue-400/15 text-blue-400',
  'bg-emerald-400/15 text-emerald-400',
  'bg-purple-400/15 text-purple-400',
  'bg-amber-400/15 text-amber-400',
  'bg-pink-400/15 text-pink-400',
  'bg-cyan-400/15 text-cyan-400'
];

const TranscriptViewer = ({ transcript, delay = 0 }) => {
  // Collapsed by default — users expand when needed
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if we have structured utterances or only raw text
  const hasUtterances = transcript?.utterances && transcript.utterances.length > 0;
  const hasRaw = transcript?.raw && transcript.raw.length > 0;

  // Nothing to show
  if (!hasUtterances && !hasRaw) return null;

  /**
   * Get a consistent color for a speaker label.
   * Uses the character code sum to pick from the palette.
   * Same speaker always gets the same color.
   */
  const getSpeakerColor = (speaker) => {
    let hash = 0;
    for (let i = 0; i < speaker.length; i++) {
      hash += speaker.charCodeAt(i);
    }
    return SPEAKER_COLORS[hash % SPEAKER_COLORS.length];
  };

  return (
    <motion.div
      className="glass rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {/* ---- Collapsible Header ---- */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 
                   hover:bg-bg-card-hover/50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center">
            <HiOutlineDocumentText className="text-xl text-blue-400" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold text-text-primary">Transcript</h2>
            <p className="text-text-muted text-xs mt-0.5">
              {hasUtterances
                ? `${transcript.utterances.length} utterances`
                : 'Raw transcript'
              }
            </p>
          </div>
        </div>

        {/* Expand/collapse chevron — rotates on toggle */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <HiOutlineChevronDown className="text-xl text-text-secondary" />
        </motion.div>
      </button>

      {/* ---- Expandable Content ---- */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 max-h-[500px] overflow-y-auto space-y-3">
              {hasUtterances ? (
                // ---- Structured utterances with speaker labels ----
                transcript.utterances.map((utterance, index) => (
                  <div key={index} className="flex gap-3">
                    {/* Speaker badge */}
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold 
                                     flex-shrink-0 h-fit mt-0.5
                                     ${getSpeakerColor(utterance.speaker)}`}>
                      {utterance.speaker}
                    </span>
                    {/* Utterance text */}
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {utterance.text}
                    </p>
                  </div>
                ))
              ) : (
                // ---- Raw text fallback ----
                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                  {transcript.raw}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TranscriptViewer;
