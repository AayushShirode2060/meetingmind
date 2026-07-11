// ============================================================
// UPLOAD ZONE COMPONENT
// Drag & drop area for audio file selection
// ============================================================
// VISUAL STATES:
//   1. Default — Dashed border, upload icon, instruction text
//   2. Drag Active — Border glows accent, background highlights
//   3. File Selected — Shows file name, size, type badge
//   4. Error — Red border, error message
//
// WHY react-dropzone?
//   - Handles drag/drop browser API complexity
//   - Provides click-to-select fallback
//   - File type filtering built-in
//   - Accessible (keyboard navigation, screen readers)
// ============================================================
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineCloudArrowUp,
  HiOutlineMusicalNote,
  HiOutlineXCircle
} from 'react-icons/hi2';
// Allowed file types and max size
const ACCEPTED_TYPES = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/x-wav': ['.wav'],
  'audio/mp4': ['.m4a'],
  'audio/x-m4a': ['.m4a']
};
const MAX_SIZE = 100 * 1024 * 1024; // 100 MB
/**
 * Reusable drag-and-drop upload zone.
 * 
 * @param {Object} props
 * @param {File|null} props.file - Currently selected file (controlled by parent)
 * @param {Function} props.onFileSelect - Called when a valid file is dropped/selected
 * @param {Function} props.onFileRemove - Called when user removes the selected file
 * @param {boolean} props.disabled - Disable interactions during upload/processing
 */
const UploadZone = ({ file, onFileSelect, onFileRemove, disabled = false }) => {
  // ---- Handle file drop ----
  // useCallback prevents re-creating this function on every render
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]); // Take only the first file
      }
    },
    [onFileSelect]
  );
  // ---- Configure react-dropzone ----
  const {
    getRootProps,     // Props for the drop zone container
    getInputProps,    // Props for the hidden file input
    isDragActive,     // True when a file is being dragged over the zone
    fileRejections    // Array of rejected files (wrong type/too big)
  } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    multiple: false,     // Only one file at a time
    disabled             // Disable when processing
  });
  // ---- Build error message from rejections ----
  const errorMessage = fileRejections.length > 0
    ? fileRejections[0].errors.map((e) => {
        if (e.code === 'file-too-large') return 'File is too large. Maximum size is 100MB.';
        if (e.code === 'file-invalid-type') return 'Invalid file type. Use MP3, WAV, or M4A.';
        return e.message;
      }).join(' ')
    : null;
  /**
   * Format file size from bytes to human-readable string.
   * @param {number} bytes
   * @returns {string} e.g., "4.5 MB"
   */
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  /**
   * Get the audio format label from MIME type.
   * @param {string} type - MIME type
   * @returns {string} e.g., "MP3"
   */
  const getFormatLabel = (type) => {
    const formats = {
      'audio/mpeg': 'MP3',
      'audio/wav': 'WAV',
      'audio/x-wav': 'WAV',
      'audio/mp4': 'M4A',
      'audio/x-m4a': 'M4A'
    };
    return formats[type] || 'AUDIO';
  };
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ===== DROP ZONE (shown when no file is selected) ===== */}
      {!file && (
        <div
          // getRootProps() adds drag-and-drop event listeners to this div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-2xl p-12
            transition-all duration-300 cursor-pointer
            flex flex-col items-center justify-center text-center
            ${disabled
              ? 'opacity-50 cursor-not-allowed border-border'
              : isDragActive
                // Drag active: glowing accent border + lighter background
                ? 'border-accent bg-accent/5 shadow-lg shadow-accent/10'
                // Default: subtle border
                : 'border-border hover:border-accent/50 hover:bg-bg-card/30'
            }
          `}
        >
          {/* Hidden file input — react-dropzone manages this */}
          <input {...getInputProps()} />
          {/* Upload icon — changes appearance when dragging */}
          <motion.div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6
                       ${isDragActive ? 'bg-accent/20' : 'bg-bg-card'}`}
            animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <HiOutlineCloudArrowUp
              className={`text-3xl ${isDragActive ? 'text-accent' : 'text-text-secondary'}`}
            />
          </motion.div>
          {/* Instruction text */}
          {isDragActive ? (
            <p className="text-accent font-medium text-lg">
              Drop your audio file here
            </p>
          ) : (
            <>
              <p className="text-text-primary font-medium text-lg mb-2">
                Drag & drop your meeting audio
              </p>
              <p className="text-text-secondary text-sm mb-4">
                or click to browse files
              </p>
              {/* Supported formats badge */}
              <div className="flex items-center gap-2">
                {['MP3', 'WAV', 'M4A'].map((fmt) => (
                  <span
                    key={fmt}
                    className="px-3 py-1 rounded-lg bg-bg-card text-text-muted 
                               text-xs font-medium border border-border"
                  >
                    {fmt}
                  </span>
                ))}
                <span className="text-text-muted text-xs ml-1">
                  Max 100MB
                </span>
              </div>
            </>
          )}
        </div>
      )}
      {/* ===== SELECTED FILE CARD (shown after file is selected) ===== */}
      <AnimatePresence>
        {file && (
          <motion.div
            className="glass p-6 rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4">
              {/* Audio file icon */}
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <HiOutlineMusicalNote className="text-2xl text-accent" />
              </div>
              {/* File info */}
              <div className="flex-1 min-w-0">
                {/* File name (truncated if too long) */}
                <p className="text-text-primary font-medium truncate">
                  {file.name}
                </p>
                {/* File size and format */}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-text-secondary text-sm">
                    {formatFileSize(file.size)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent 
                                   text-xs font-medium">
                    {getFormatLabel(file.type)}
                  </span>
                </div>
              </div>
              {/* Remove file button */}
              {!disabled && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();  // Don't trigger dropzone
                    onFileRemove();
                  }}
                  className="p-2 rounded-xl hover:bg-danger/10 text-text-secondary 
                             hover:text-danger transition-colors duration-200"
                  title="Remove file"
                >
                  <HiOutlineXCircle className="text-xl" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ===== ERROR MESSAGE ===== */}
      <AnimatePresence>
        {errorMessage && (
          <motion.p
            className="mt-4 text-danger text-sm text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
export default UploadZone;