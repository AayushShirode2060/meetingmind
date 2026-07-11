// ============================================================
// LOADER COMPONENT
// Animated loading indicator with status text
// ============================================================
// USAGE:
//   <Loader />                              → Default "Processing..."
//   <Loader status="Transcribing audio..." /> → Custom status text
//   <Loader size="sm" />                     → Smaller variant
// ============================================================

import { motion } from 'framer-motion';

const Loader = ({ status = 'Processing...', size = 'md' }) => {
  // Size variants — controls the ring dimensions
  const sizes = {
    sm: { ring: 40, dot: 8 },
    md: { ring: 64, dot: 12 },
    lg: { ring: 80, dot: 16 }
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      {/* ---- Animated Rings ---- */}
      {/* Three concentric rings that pulse outward */}
      <div className="relative" style={{ width: s.ring * 2, height: s.ring * 2 }}>
        {/* Outer ring — pulses with delay */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-accent/30"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* Middle ring — pulses with different delay */}
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-accent/50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3  // Offset creates a wave effect
          }}
        />

        {/* Inner ring — primary animation */}
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-accent"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [1, 0.3, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.6
          }}
        />

        {/* Center dot — rotating glow */}
        <motion.div
          className="absolute rounded-full bg-accent glow"
          style={{
            width: s.dot,
            height: s.dot,
            top: '50%',
            left: '50%',
            marginTop: -(s.dot / 2),
            marginLeft: -(s.dot / 2)
          }}
          animate={{
            scale: [1, 1.3, 1],
            boxShadow: [
              '0 0 20px rgba(108, 99, 255, 0.3)',
              '0 0 40px rgba(108, 99, 255, 0.6)',
              '0 0 20px rgba(108, 99, 255, 0.3)'
            ]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      {/* ---- Status Text ---- */}
      {/* Fades in and gently pulses to indicate activity */}
      <motion.p
        className="text-text-secondary text-sm font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Animated dots after status text */}
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {status}
        </motion.span>
      </motion.p>
    </div>
  );
};

export default Loader;
