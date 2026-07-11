// ============================================================
// SUMMARY CARD
// Reusable card for displaying text-based summary sections
// ============================================================
// USAGE:
//   <SummaryCard
//     title="Executive Summary"
//     icon={HiOutlineSparkles}
//     content="The team discussed..."
//   />
// ============================================================

import { motion } from 'framer-motion';

/**
 * @param {Object} props
 * @param {string} props.title - Section title (e.g., "Executive Summary")
 * @param {React.Component} props.icon - HeroIcon component
 * @param {string} props.content - The text content to display
 * @param {string} [props.iconColor] - Tailwind text color class for the icon
 * @param {number} [props.delay] - Animation delay in seconds
 */
const SummaryCard = ({ title, icon: Icon, content, iconColor = 'text-accent', delay = 0 }) => {
  // Don't render if there's no content
  if (!content) return null;

  return (
    <motion.div
      className="glass p-6 rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center`}>
          <Icon className={`text-xl ${iconColor}`} />
        </div>
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      </div>

      {/* Content — preserves line breaks from the AI output */}
      <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </motion.div>
  );
};

export default SummaryCard;
