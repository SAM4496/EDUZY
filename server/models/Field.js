const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, uppercase: true, trim: true },
  description: { type: String, trim: true },
  type: { 
    type: String, 
    enum: ['engineering', 'medical', 'commerce', 'science', 'arts', 'computer_science', 'law', 'management', 'other'],
    default: 'other'
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Unique field code within an institute
FieldSchema.index({ institute: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Field', FieldSchema);
