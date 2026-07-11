// ============================================================
// ACTION ITEMS TABLE
// Structured table of tasks extracted by AI
// ============================================================
// COLUMNS: Task | Owner | Deadline
// Each row is one action item from meeting.actionItems[]
//
// RESPONSIVE: Wraps in a scrollable container on small screens
// ============================================================

import { motion } from 'framer-motion';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';

const ActionItemsTable = ({ items = [], delay = 0 }) => {
  // Don't render if no action items
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
        <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
          <HiOutlineClipboardDocumentList className="text-xl text-emerald-400" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary">
          Action Items ({items.length})
        </h2>
      </div>

      {/* Scrollable table container for mobile */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-text-muted font-medium">Task</th>
              <th className="text-left py-3 px-4 text-text-muted font-medium">Owner</th>
              <th className="text-left py-3 px-4 text-text-muted font-medium">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className="border-b border-border/50 last:border-b-0 
                           hover:bg-bg-card-hover/50 transition-colors duration-200"
              >
                <td className="py-3 px-4 text-text-primary">{item.task}</td>
                <td className="py-3 px-4 text-text-secondary">{item.owner}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium">
                    {item.deadline}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ActionItemsTable;
