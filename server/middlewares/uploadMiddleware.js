const multer = require('multer');
const path = require('path');
const { ALLOWED_AUDIO_MIMES, ALLOWED_EXTENSIONS, MAX_FILE_SIZE } = require('../utils/constants');
// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'audio'));
  },
  filename: (req, file, cb) => {
    // Unique filename: timestamp-originalname
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, uniqueName);
  }
});
// File filter — only allow audio files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_AUDIO_MIMES.includes(file.mimetype) || ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed formats: ${ALLOWED_EXTENSIONS.join(', ')}`), false);
  }
};
// Create the multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});
module.exports = upload;