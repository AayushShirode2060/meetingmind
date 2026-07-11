// ============================================================
// INSIGHTS LIST
// Reusable list for decisions, deadlines, risks
// ============================================================
// USAGE:
//   <InsightsList
//     title="Key Decisions"
//     icon={HiOutlineLightBulb}
//     items={['Decision 1', 'Decision 2']}
//   />
//
// For deadlines (which are objects with .item and .date):
//   <InsightsList
//     title="Deadlines"
//     icon={HiOutlineCalendar}
//     items={meeting.deadlines}
//     isDeadline={true}
//   />
// ============================================================

import { motion } from 'framer-motion';

/**
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {React.Component} props.icon - HeroIcon component
 * @param {Array} props.items - Array of strings or deadline objects
 * @param {string} [props.iconColor] - Tailwind text color class
 * @param {string} [props.iconBg] - Tailwind bg color class
 * @param {boolean} [props.isDeadline] - If true, items are {item, date} objects
 * @param {number} [props.delay] - Animation delay
 */
const InsightsList = ({
  title,
  icon: Icon,
  items = [],
  iconColor = 'text-accent',
  iconBg = 'bg-accent/10',
  isDeadline = false,
  delay = 0
}) => {
  // Don't render if no items
  if (!items || items.length === 0) return null;

  return (
    <motion.div
      className="glass p-6 rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`text-xl ${iconColor}`} />
        </div>
        <h2 className="text-lg font-semibold text-text-primary">
          {title} ({items.length})
        </h2>
      </div>

      {/* Items list */}
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm"
          >
            {/* Bullet dot */}
            <span className={`w-2 h-2 rounded-full ${iconBg} mt-1.5 flex-shrink-0`} />

            {isDeadline ? (
              // Deadline items have both .item and .date
              <div className="flex-1">
                <span className="text-text-primary">{item.item}</span>
                <span className="ml-2 px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-400 text-xs font-medium">
                  {item.date}
                </span>
              </div>
            ) : (
              // String items (decisions, risks)
              <span className="text-text-secondary leading-relaxed">{item}</span>
            )}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default InsightsList;
