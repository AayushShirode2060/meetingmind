import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      {/* Animated 404 text */}
      <motion.h1
        className="text-8xl font-extrabold gradient-text mb-4"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        404
      </motion.h1>

      <motion.p
        className="text-xl text-text-secondary mb-8 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Oops! This page doesn't exist.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Link
          to="/"
          className="px-6 py-3 bg-accent hover:bg-accent-light text-white rounded-xl 
                     font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
