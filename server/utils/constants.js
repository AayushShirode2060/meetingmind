const MEETING_STATUS = {
  UPLOADED: 'uploaded',
  TRANSCRIBING: 'transcribing',
  SUMMARIZING: 'summarizing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};
const ALLOWED_AUDIO_MIMES = [
  'audio/mpeg',          // .mp3
  'audio/wav',           // .wav
  'audio/x-wav',         // .wav (alternate)
  'audio/mp4',           // .m4a
  'audio/x-m4a',         // .m4a (alternate)
  'audio/m4a'            // .m4a (alternate)
];
const ALLOWED_EXTENSIONS = ['.mp3', '.wav', '.m4a'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
module.exports = {
  MEETING_STATUS,
  ALLOWED_AUDIO_MIMES,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE
};