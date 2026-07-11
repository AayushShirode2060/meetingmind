const mongoose = require('mongoose');
const utteranceSchema = new mongoose.Schema({
  speaker: { type: String, required: true },
  text: { type: String, required: true },
  start: { type: Number },   // milliseconds
  end: { type: Number }      // milliseconds
}, { _id: false });
const actionItemSchema = new mongoose.Schema({
  task: { type: String, required: true },
  owner: { type: String, default: 'Unassigned' },
  deadline: { type: String, default: 'Not specified' }
}, { _id: false });
const deadlineSchema = new mongoose.Schema({
  item: { type: String, required: true },
  date: { type: String, required: true }
}, { _id: false });
const chatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });
const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  originalFileName: {
    type: String
  },
  audioUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['uploaded', 'transcribing', 'summarizing', 'completed', 'failed'],
    default: 'uploaded'
  },
  transcript: {
    raw: { type: String, default: '' },
    utterances: [utteranceSchema]
  },
  summary: { type: String, default: '' },
  keyDecisions: [{ type: String }],
  actionItems: [actionItemSchema],
  deadlines: [deadlineSchema],
  risks: [{ type: String }],
  followUpEmail: { type: String, default: '' },
  chatHistory: [chatMessageSchema],
  duration: { type: Number },         // audio duration in seconds
  speakerCount: { type: Number },
  error: { type: String }
}, {
  timestamps: true   // adds createdAt and updatedAt automatically
});
// Index for sorting by creation date (most recent first)
meetingSchema.index({ createdAt: -1 });
module.exports = mongoose.model('Meeting', meetingSchema);