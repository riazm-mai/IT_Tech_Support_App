const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  incidentDate: {
    type: Date,
    required: false,
    default: Date.now
  },
  priority: {
    type: String,
    default: 'Low'
  },
  category: {
    type: String,
    default: 'Software'
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
