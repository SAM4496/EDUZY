const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  hod: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

DepartmentSchema.virtual('facultyCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'department',
  count: true,
  match: { role: 'faculty', isActive: true }
});

DepartmentSchema.virtual('studentCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'department',
  count: true,
  match: { role: 'student', isActive: true }
});

module.exports = mongoose.model('Department', DepartmentSchema);
