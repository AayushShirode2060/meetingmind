/**
 * Global error handling middleware
 * Must be registered LAST in the Express middleware chain
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  // Log full stack in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  // Multer errors (file upload issues)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File too large. Maximum size is 100MB.'
    });
  }
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: messages.join(', ')
    });
  }
  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(404).json({
      success: false,
      error: 'Resource not found.'
    });
  }
  // Default server error
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error.'
  });
};
module.exports = errorHandler;