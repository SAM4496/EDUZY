const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  files: [String],
  submittedAt: { type: Date, default: Date.now },
  score: Number,
  grade: String,
  feedback: String,
  status: { type: String, enum: ['pending', 'submitted', 'graded'], default: 'submitted' }
});

SubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
