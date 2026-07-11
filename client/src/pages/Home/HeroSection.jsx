// ============================================================
// HERO SECTION
// The first thing users see — headline, subtitle, CTA buttons
// ============================================================
// ANIMATIONS:
//   - Background gradient blobs pulse slowly (breathing effect)
//   - Content elements stagger in from bottom (fade-up)
//   - CTA button bounces icon on hover
// ============================================================
import { motion } from 'framer-motion';
import {
  HiOutlineSparkles,
  HiOutlineCloudArrowUp,
  HiOutlineCheckCircle
} from 'react-icons/hi2';
const HeroSection = ({ navigate }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4">
      {/* ---- Animated Background Gradients ---- */}
      {/* Absolute-positioned blobs that sit behind content */}
      {/* They pulse slowly to create a "living" background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary blob — top center, accent purple */}
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] 
                     rounded-full bg-accent/10 blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        {/* Secondary blob — bottom right, for visual depth */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] 
                     rounded-full bg-purple-500/8 blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
        />
      </div>
      {/* ---- Hero Content ---- */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge pill — credibility indicator */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                     bg-accent/10 border border-accent/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HiOutlineSparkles className="text-accent text-sm" />
          <span className="text-sm text-accent font-medium">
            AI-Powered Meeting Assistant
          </span>
        </motion.div>
        {/* Main headline — gradient text for visual impact */}
        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <span className="text-text-primary">Transform Meetings</span>
          <br />
          <span className="gradient-text">Into Action</span>
        </motion.h1>
        {/* Subtitle — explains the product in one sentence */}
        <motion.p
          className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Upload your meeting audio and let AI transcribe, summarize, 
          and extract action items — so you can focus on what matters.
        </motion.p>
        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          {/* Primary CTA */}
          <button
            onClick={() => navigate('/upload')}
            className="group px-8 py-4 bg-accent hover:bg-accent-light text-white 
                       rounded-2xl font-semibold text-lg transition-all duration-300 
                       hover:shadow-lg hover:shadow-accent/25 hover:scale-105
                       flex items-center gap-2"
          >
            <HiOutlineCloudArrowUp className="text-xl group-hover:animate-bounce" />
            Upload Meeting
          </button>
          {/* Secondary CTA */}
          <button
            onClick={() => navigate('/history')}
            className="px-8 py-4 bg-bg-card hover:bg-bg-card-hover text-text-primary 
                       rounded-2xl font-semibold text-lg transition-all duration-300
                       border border-border hover:border-accent/30"
          >
            View History
          </button>
        </motion.div>
        {/* Feature checks — quick trust indicators */}
        <motion.div
          className="flex items-center justify-center gap-8 mt-16 text-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {['Speaker Detection', 'AI Summaries', 'PDF Export'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              {i > 0 && <div className="hidden sm:block w-px h-4 bg-border mr-6" />}
              <HiOutlineCheckCircle className="text-success text-lg" />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
export default HeroSection;