// ============================================================
// NAVBAR COMPONENT
// Fixed navigation bar with glassmorphism + mobile hamburger
// ============================================================
// RESPONSIVE BEHAVIOR:
//   Desktop (≥640px): Horizontal nav links with icons + labels
//   Mobile (<640px):  Hamburger button → animated slide-down menu
//
// WHY useState for mobile menu?
//   The menu needs to toggle open/close. We track this with a
//   simple boolean state. AnimatePresence handles the animation.
// ============================================================
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSparkles } from 'react-icons/hi2';
import {
  HiOutlineHome,
  HiOutlineCloudArrowUp,
  HiOutlineClock,
  HiOutlineBars3,
  HiOutlineXMark
} from 'react-icons/hi2';
const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Navigation links — data-driven
  const navLinks = [
    { path: '/', label: 'Home', icon: HiOutlineHome },
    { path: '/upload', label: 'Upload', icon: HiOutlineCloudArrowUp },
    { path: '/history', label: 'History', icon: HiOutlineClock }
  ];
  /**
   * Check if a nav link is active.
   * Exact match for "/" (home), prefix match for others.
   */
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  // Close mobile menu when route changes
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 
                 bg-bg-primary/80 backdrop-blur-xl 
                 border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ===== LOGO ===== */}
          <Link to="/" className="flex items-center gap-2 group" onClick={handleNavClick}>
            <div className="p-2 rounded-xl bg-accent/10 group-hover:bg-accent/20 
                          transition-colors duration-300">
              <HiOutlineSparkles className="text-xl text-accent" />
            </div>
            <span className="text-lg font-bold gradient-text">
              MeetingMind AI
            </span>
          </Link>
          {/* ===== DESKTOP NAV LINKS (hidden on mobile) ===== */}
          <div className="hidden sm:flex items-center gap-1">
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
                      ? 'bg-accent/15 text-accent'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-card/50'
                    }
                  `}
                >
                  <Icon className="text-lg" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
          {/* ===== MOBILE HAMBURGER BUTTON (hidden on desktop) ===== */}
          <button
            className="sm:hidden p-2 rounded-xl text-text-secondary 
                       hover:text-text-primary hover:bg-bg-card/50 
                       transition-all duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen
              ? <HiOutlineXMark className="text-xl" />
              : <HiOutlineBars3 className="text-xl" />
            }
          </button>
        </div>
      </div>
      {/* ===== MOBILE MENU OVERLAY ===== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="sm:hidden border-t border-border bg-bg-primary/95 backdrop-blur-xl"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={handleNavClick}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                      transition-all duration-200
                      ${active
                        ? 'bg-accent/15 text-accent'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-card/50'
                      }
                    `}
                  >
                    <Icon className="text-lg" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
export default Navbar;