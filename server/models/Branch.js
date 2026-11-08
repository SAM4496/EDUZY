const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, uppercase: true, trim: true },
  address: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Unique branch code within an institute
BranchSchema.index({ institute: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Branch', BranchSchema);
