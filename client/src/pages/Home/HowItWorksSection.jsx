// ============================================================
// HOW IT WORKS SECTION
// 3-step visual timeline showing the user flow
// ============================================================
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  HiOutlineCloudArrowUp,
  HiOutlineCpuChip,
  HiOutlineLightBulb
} from 'react-icons/hi2';
// Steps data — defined outside component (no re-creation on render)
const steps = [
  {
    icon: HiOutlineCloudArrowUp,
    title: 'Upload Audio',
    description: 'Drag & drop your meeting recording. Supports MP3, WAV, and M4A formats.',
    step: '01'
  },
  {
    icon: HiOutlineCpuChip,
    title: 'AI Processes',
    description: 'AssemblyAI transcribes with speaker labels. Gemini extracts insights.',
    step: '02'
  },
  {
    icon: HiOutlineLightBulb,
    title: 'Get Insights',
    description: 'View summaries, decisions, action items. Chat with your meeting or export PDF.',
    step: '03'
  }
];
const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <section className="py-24 px-4 gradient-bg" ref={ref}>
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            How It Works
          </h2>
          <p className="text-text-secondary text-lg">
            Three simple steps to meeting clarity.
          </p>
        </motion.div>
        {/* Steps timeline */}
        <div className="relative">
          {/* Connecting line — horizontal, desktop only */}
          <div className="hidden lg:block absolute top-16 left-[15%] right-[15%] 
                          h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + index * 0.15
                }}
              >
                {/* Step icon with glow ring + number badge */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="absolute w-20 h-20 rounded-full bg-accent/10 animate-pulse" />
                  <div className="relative w-16 h-16 rounded-2xl bg-bg-card border 
                                  border-accent/30 flex items-center justify-center z-10">
                    <step.icon className="text-2xl text-accent" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full 
                                   bg-accent text-white text-xs font-bold 
                                   flex items-center justify-center z-20">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default HowItWorksSection;