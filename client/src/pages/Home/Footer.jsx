// ============================================================
// FOOTER
// Brand credit and links
// ============================================================

import { HiOutlineSparkles } from 'react-icons/hi2';

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto text-center">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <HiOutlineSparkles className="text-accent" />
          <span className="font-bold gradient-text">MeetingMind AI</span>
        </div>
        {/* Credit */}
        <p className="text-text-muted text-sm">
          Built for the Unthinkable Solutions Technical Assessment
        </p>
      </div>
    </footer>
  );
};

export default Footer;
