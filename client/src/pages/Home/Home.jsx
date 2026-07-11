// ============================================================
// HOME PAGE — Thin Orchestrator
// ============================================================
// This file composes landing page sections in order.
// Each section is a separate component file in the same directory.
//
// WHY this pattern?
//   - Home.jsx stays under 30 lines (easy to scan)
//   - Each section is independently editable/testable
//   - Adding/removing/reordering sections = moving import lines
//   - Follows the Composition pattern from React best practices
// ============================================================
import { useNavigate } from 'react-router-dom';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import Footer from './Footer';
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="overflow-hidden">
      <HeroSection navigate={navigate} />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
};
export default Home;