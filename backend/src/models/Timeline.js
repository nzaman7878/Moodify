const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  // Links this entry to the specific user/student in your database
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: true
  },
  note: {
    type: String,
    trim: true,
    maxLength: 150, // Keeps the journal entries concise
    default: ""     // Optional by default
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model('Timeline', timelineSchema);