// ============================================================
// NAVBAR COMPONENT
// Fixed navigation bar with glassmorphism styling
// ============================================================
// DESIGN DECISIONS:
// - Fixed at top (always accessible)
// - Glassmorphism effect (premium feel)
// - Active route highlighting (clear navigation state)
// - Responsive (hamburger menu on mobile — added in Phase 10)
// ============================================================

import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { 
  HiOutlineHome, 
  HiOutlineCloudArrowUp, 
  HiOutlineClock 
} from 'react-icons/hi2';

const Navbar = () => {
  // useLocation gives us the current URL path
  // We use this to highlight the active navigation link
  const location = useLocation();

  // Navigation links configuration
  // Adding new pages is as simple as adding an object here
  const navLinks = [
    { path: '/', label: 'Home', icon: HiOutlineHome },
    { path: '/upload', label: 'Upload', icon: HiOutlineCloudArrowUp },
    { path: '/history', label: 'History', icon: HiOutlineClock }
  ];

  /**
   * Check if a nav link is currently active.
   * Exact match for "/" (home), prefix match for other routes.
   */
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      // ---- Fixed positioning + glassmorphism ----
      // fixed: stays at top during scroll
      // backdrop-blur-xl: frosted glass effect
      // bg-bg-primary/80: 80% opacity of primary bg color
      // z-50: always on top of other content
      className="fixed top-0 left-0 right-0 z-50 
                 bg-bg-primary/80 backdrop-blur-xl 
                 border-b border-border"
      // ---- Entrance animation ----
      // Slides down from top when page loads
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ===== LOGO ===== */}
          <Link to="/" className="flex items-center gap-2 group">
            {/* Sparkle icon with accent color */}
            <div className="p-2 rounded-xl bg-accent/10 group-hover:bg-accent/20 
                          transition-colors duration-300">
              <HiOutlineSparkles className="text-xl text-accent" />
            </div>
            {/* Brand name with gradient text */}
            <span className="text-lg font-bold gradient-text">
              MeetingMind AI
            </span>
          </Link>

          {/* ===== NAVIGATION LINKS ===== */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                    transition-all duration-300
                    ${active
                      // Active state: accent background + white text
                      ? 'bg-accent/15 text-accent'
                      // Inactive state: muted text, hover highlights
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-card/50'
                    }
                  `}
                >
                  <Icon className="text-lg" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
