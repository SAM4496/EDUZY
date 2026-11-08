const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  credits: { type: Number, required: true, min: 1, max: 6 },
  semester: { type: Number, required: true, min: 1, max: 8 },
  totalModules: { type: Number, default: 10 },
  description: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);
