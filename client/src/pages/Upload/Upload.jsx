// ============================================================
// UPLOAD PAGE
// Handles the complete upload → process → redirect flow
// ============================================================
// STATE MACHINE (the page transitions through these stages):
//
//   idle        → User selects a file
//   uploading   → File being sent to server (progress bar shown)
//   transcribing→ AssemblyAI is transcribing audio
//   summarizing → Gemini is generating summary
//   completed   → Processing done, redirecting to meeting page
//   error       → Something failed (retry option shown)
//
// WHY a state machine approach?
//   - Each stage has different UI (progress bar, spinner, error)
//   - Prevents invalid transitions (can't summarize before uploading)
//   - Easy to add new stages or modify flow
// ============================================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineRocketLaunch,
  HiOutlineArrowPath,
  HiOutlineExclamationTriangle
} from 'react-icons/hi2';
// Components
import UploadZone from '../../components/Upload/UploadZone';
import Loader from '../../components/Loader/Loader';
// API services
import { uploadAudio, summarizeMeeting } from '../../services/meetingService';
const Upload = () => {
  const navigate = useNavigate();
  // ---- State ----
  const [file, setFile] = useState(null);           // Selected audio file
  const [stage, setStage] = useState('idle');        // Current processing stage
  const [uploadProgress, setUploadProgress] = useState(0);  // Upload % (0-100)
  const [errorMessage, setErrorMessage] = useState('');      // Error details
  // ---- Stage status text (shown in the Loader component) ----
  const stageText = {
    uploading: 'Uploading audio...',
    transcribing: 'Transcribing audio with AssemblyAI...',
    summarizing: 'Generating AI summary with Gemini...',
    completed: 'Processing complete! Redirecting...'
  };
  /**
   * Handle the entire upload + process flow.
   * 
   * This function runs through 3 sequential API calls:
   *   1. Upload the file → POST /api/meetings/upload
   *   2. Trigger processing → POST /api/meetings/:id/summarize
   *   3. Redirect to meeting page
   * 
   * Each step updates the `stage` state so the UI shows the right content.
   */
  const handleProcess = async () => {
    if (!file) return;
    try {
      // ---- STEP 1: UPLOAD FILE ----
      setStage('uploading');
      setUploadProgress(0);
      setErrorMessage('');
      // Create FormData — required for file uploads
      // The key 'audio' must match what multer expects on the backend
      const formData = new FormData();
      formData.append('audio', file);
      // Upload with progress tracking
      // onProgress callback receives percentage from axios
      const uploadRes = await uploadAudio(formData, (percent) => {
        setUploadProgress(percent);
      });
      const meetingId = uploadRes.data.data._id;
      // ---- STEP 2: TRIGGER PROCESSING ----
      // This is a long-running request: transcription + summarization
      // We show different loading text for each phase
      setStage('transcribing');
      // After 15 seconds, switch to "summarizing" text
      // This is an approximation — we don't get real-time status from the backend
      // (the actual processing might be faster or slower)
      const summarizingTimer = setTimeout(() => {
        setStage('summarizing');
      }, 15000);
      // Call the summarize endpoint (this blocks until fully done)
      await summarizeMeeting(meetingId);
      clearTimeout(summarizingTimer);
      // ---- STEP 3: DONE — REDIRECT ----
      setStage('completed');
      toast.success('Meeting processed successfully!');
      // Short delay before redirect so user sees the success state
      setTimeout(() => {
        navigate(`/meeting/${meetingId}`);
      }, 1500);
    } catch (error) {
      // ---- ERROR HANDLING ----
      setStage('error');
      // Extract meaningful error message from the axios error
      const message = error.response?.data?.error
        || error.message
        || 'Something went wrong. Please try again.';
      setErrorMessage(message);
      toast.error('Processing failed');
    }
  };
  /**
   * Reset everything back to initial state (for retry).
   */
  const handleReset = () => {
    setFile(null);
    setStage('idle');
    setUploadProgress(0);
    setErrorMessage('');
  };
  // Is the page currently processing? (used to disable interactions)
  const isProcessing = ['uploading', 'transcribing', 'summarizing', 'completed'].includes(stage);
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* ---- Page Header ---- */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Upload Meeting Audio
          </h1>
          <p className="text-text-secondary text-lg">
            Drop your audio file and let AI do the rest
          </p>
        </motion.div>
        {/* ---- Main Content (switches based on stage) ---- */}
        <AnimatePresence mode="wait">
          {/* ===== IDLE: File Selection ===== */}
          {stage === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Drop zone component */}
              <UploadZone
                file={file}
                onFileSelect={(selectedFile) => setFile(selectedFile)}
                onFileRemove={() => setFile(null)}
                disabled={isProcessing}
              />
              {/* Process button — only visible after file selection */}
              <AnimatePresence>
                {file && (
                  <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <button
                      onClick={handleProcess}
                      className="group px-8 py-4 bg-accent hover:bg-accent-light 
                                 text-white rounded-2xl font-semibold text-lg 
                                 transition-all duration-300 hover:shadow-lg 
                                 hover:shadow-accent/25 hover:scale-105
                                 flex items-center gap-3 mx-auto"
                    >
                      <HiOutlineRocketLaunch className="text-xl group-hover:rotate-12 transition-transform" />
                      Start Processing
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
          {/* ===== UPLOADING: Progress Bar ===== */}
          {stage === 'uploading' && (
            <motion.div
              key="uploading"
              className="glass p-8 rounded-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* File info reminder */}
              <p className="text-text-secondary text-sm text-center mb-6">
                Uploading <span className="text-text-primary font-medium">{file?.name}</span>
              </p>
              {/* Progress bar container */}
              <div className="w-full bg-bg-secondary rounded-full h-3 mb-4 overflow-hidden">
                {/* 
                  Animated progress bar fill.
                  Width is set to the upload percentage.
                  The transition makes it smooth instead of jumpy.
                */}
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light"
                  initial={{ width: '0%' }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
              {/* Percentage text */}
              <p className="text-center text-accent font-semibold text-lg">
                {uploadProgress}%
              </p>
              <p className="text-center text-text-muted text-sm mt-2">
                {stageText.uploading}
              </p>
            </motion.div>
          )}
          {/* ===== TRANSCRIBING / SUMMARIZING: Loader ===== */}
          {(stage === 'transcribing' || stage === 'summarizing') && (
            <motion.div
              key="processing"
              className="glass p-8 rounded-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated loader with status text */}
              <Loader status={stageText[stage]} />
              {/* Processing tip */}
              <p className="text-text-muted text-xs text-center mt-4">
                This may take 1-5 minutes depending on audio length. Please don't close this tab.
              </p>
              {/* Stage indicator dots */}
              <div className="flex items-center justify-center gap-3 mt-6">
                {['Upload', 'Transcribe', 'Summarize'].map((label, index) => {
                  // Determine if this step is done, active, or pending
                  const stageOrder = ['uploading', 'transcribing', 'summarizing'];
                  const currentIndex = stageOrder.indexOf(stage);
                  const isDone = index < currentIndex + 1;
                  const isCurrent = index === currentIndex;
                  return (
                    <div key={label} className="flex items-center gap-2">
                      {/* Step dot */}
                      <div
                        className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                          isDone
                            ? 'bg-accent'           // Completed step
                            : isCurrent
                              ? 'bg-accent animate-pulse'  // Current step
                              : 'bg-border'         // Pending step
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          isDone || isCurrent ? 'text-text-primary' : 'text-text-muted'
                        }`}
                      >
                        {label}
                      </span>
                      {/* Connector line between steps */}
                      {index < 2 && (
                        <div className={`w-8 h-px ${isDone ? 'bg-accent' : 'bg-border'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
          {/* ===== COMPLETED: Success Message ===== */}
          {stage === 'completed' && (
            <motion.div
              key="completed"
              className="glass p-8 rounded-2xl text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Success checkmark animation */}
              <motion.div
                className="w-20 h-20 rounded-full bg-success/10 flex items-center 
                           justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                <span className="text-4xl">✓</span>
              </motion.div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                Processing Complete!
              </h2>
              <p className="text-text-secondary">
                Redirecting to your meeting summary...
              </p>
            </motion.div>
          )}
          {/* ===== ERROR: Failure Message with Retry ===== */}
          {stage === 'error' && (
            <motion.div
              key="error"
              className="glass p-8 rounded-2xl text-center border border-danger/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Error icon */}
              <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center 
                            justify-center mx-auto mb-6">
                <HiOutlineExclamationTriangle className="text-3xl text-danger" />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">
                Processing Failed
              </h2>
              {/* Error details */}
              <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
                {errorMessage}
              </p>
              {/* Retry button */}
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-bg-card hover:bg-bg-card-hover text-text-primary 
                           rounded-xl font-medium transition-all duration-300
                           border border-border hover:border-accent/30
                           flex items-center gap-2 mx-auto"
              >
                <HiOutlineArrowPath className="text-lg" />
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default Upload;