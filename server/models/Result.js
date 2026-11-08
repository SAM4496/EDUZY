const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semester: { type: Number, required: true },
  academicYear: String,
  internalMarks: { type: Number, required: true },
  externalMarks: { type: Number, required: true },
  total: Number,
  grade: String,
  gradePoints: Number,
  createdAt: { type: Date, default: Date.now }
});

ResultSchema.index({ student: 1, course: 1, semester: 1 }, { unique: true });

ResultSchema.pre('save', function(next) {
  this.total = this.internalMarks + this.externalMarks;
  
  if (this.total >= 90) {
    this.grade = 'O';
    this.gradePoints = 10;
  } else if (this.total >= 80) {
    this.grade = 'A+';
    this.gradePoints = 9;
  } else if (this.total >= 70) {
    this.grade = 'A';
    this.gradePoints = 8;
  } else if (this.total >= 60) {
    this.grade = 'B+';
    this.gradePoints = 7;
  } else if (this.total >= 50) {
    this.grade = 'B';
    this.gradePoints = 6;
  } else if (this.total >= 40) {
    this.grade = 'C';
    this.gradePoints = 5;
  } else {
    this.grade = 'F';
    this.gradePoints = 0;
  }
  
  next();
});

module.exports = mongoose.model('Result', ResultSchema);
