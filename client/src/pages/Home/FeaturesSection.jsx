// ============================================================
// FEATURES SECTION
// 4 glassmorphism cards showing core product capabilities
// ============================================================
// PATTERN: Data-driven rendering
//   Features are defined as an array of objects.
//   Adding/removing a feature = editing the array, not the JSX.
//   This is a scalable pattern used in production apps.
// ============================================================
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  HiOutlineSparkles,
  HiOutlineChatBubbleLeftRight,
  HiOutlineDocumentArrowDown,
  HiOutlineUserGroup
} from 'react-icons/hi2';
// ---- Feature data ----
// Defined outside the component so it's not re-created on every render.
// Each feature has: icon, title, description, color scheme.
const features = [
  {
    icon: HiOutlineUserGroup,
    title: 'Speaker Diarization',
    description: 'Automatically identifies and labels different speakers in your meeting audio using AssemblyAI.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10'
  },
  {
    icon: HiOutlineSparkles,
    title: 'AI Summaries & Actions',
    description: 'Gemini AI extracts executive summaries, key decisions, action items, deadlines, and risks.',
    color: 'text-accent',
    bgColor: 'bg-accent/10'
  },
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: 'Chat with Your Meeting',
    description: 'Ask follow-up questions about any meeting. The AI answers strictly from your transcript.',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10'
  },
  {
    icon: HiOutlineDocumentArrowDown,
    title: 'PDF Reports',
    description: 'Generate and download professional meeting reports with one click. Ready to share.',
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10'
  }
];
const FeaturesSection = () => {
  // useRef + useInView: Detect when section enters viewport
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,       // Animate only once
    margin: '-100px'  // Trigger 100px before fully visible
  });
  return (
    <section className="py-24 px-4" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Everything You Need
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            From transcription to actionable insights, MeetingMind AI handles the entire workflow.
          </p>
        </motion.div>
        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass p-6 rounded-2xl hover:bg-bg-card-hover 
                         transition-all duration-300 hover:-translate-y-1
                         hover:shadow-lg hover:shadow-accent/5 group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.1  // Stagger each card by 100ms
              }}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} 
                              flex items-center justify-center mb-4
                              group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`text-2xl ${feature.color}`} />
              </div>
              {/* Title */}
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              {/* Description */}
              <p className="text-text-secondary text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeaturesSection;