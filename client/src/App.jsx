// ============================================================
// APP.JSX — Root Application Component
// Sets up routing, layout, and global providers
// ============================================================
// ROUTING MAP:
//   /              → Landing page (Home)
//   /upload        → Audio upload page
//   /meeting/:id   → Meeting detail page (transcript, summary, etc.)
//   /history       → List of all past meetings
//   /meeting/:id/chat → AI chat with a specific meeting
//   *              → 404 Not Found page
// ============================================================
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// Layout components
import Navbar from './components/Navbar/Navbar';
// Page components
// Each page is lazy-loadable later for performance,
// but for now we import them directly
import Home from './pages/Home/Home';
import Upload from './pages/Upload/Upload';
import MeetingPage from './pages/Meeting/Meeting';
import History from './pages/History/History';
import Chat from './pages/Chat/Chat';
import NotFound from './pages/NotFound/NotFound';
function App() {
  return (
    // BrowserRouter provides the routing context to all child components
    // It uses the browser's History API for clean URLs (no # fragments)
    <Router>
      {/* ---- Global Toast Notifications ---- */}
      {/* react-hot-toast renders toast notifications here */}
      {/* position: top-right — non-intrusive, visible */}
      {/* Dark theme styling to match our UI */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a2e',
            color: '#e8e8f0',
            border: '1px solid #2a2a40',
            borderRadius: '12px',
            fontSize: '14px'
          },
          success: {
            iconTheme: { primary: '#4ade80', secondary: '#1a1a2e' }
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#1a1a2e' }
          }
        }}
      />
      {/* ---- Navbar (appears on every page) ---- */}
      <Navbar />
      {/* ---- Main Content Area ---- */}
      {/* pt-20: padding-top to offset the fixed Navbar height */}
      <main className="min-h-screen pt-20">
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<Home />} />
          {/* Upload audio file */}
          <Route path="/upload" element={<Upload />} />
          {/* Meeting detail — :id is a URL parameter (MongoDB ObjectId) */}
          <Route path="/meeting/:id" element={<MeetingPage />} />
          {/* Meeting history list */}
          <Route path="/history" element={<History />} />
          {/* AI chat for a specific meeting */}
          <Route path="/meeting/:id/chat" element={<Chat />} />
          {/* 404 catch-all — matches any unrecognized URL */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}
export default App;