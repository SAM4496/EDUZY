const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  semester: { type: Number, required: true },
  academicYear: String,
  tuition: { type: Number, default: 0 },
  lab: { type: Number, default: 0 },
  library: { type: Number, default: 0 },
  sports: { type: Number, default: 0 },
  exam: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paid: { type: Number, default: 0 },
  balance: Number,
  status: { type: String, enum: ['paid', 'partial', 'due'], default: 'due' },
  dueDate: Date,
  paidDate: Date,
  receiptNo: String,
  createdAt: { type: Date, default: Date.now }
});

FeeSchema.pre('save', function(next) {
  this.balance = this.total - this.paid;
  if (this.balance <= 0) {
    this.status = 'paid';
  } else if (this.paid > 0) {
    this.status = 'partial';
  } else {
    this.status = 'due';
  }
  next();
});

module.exports = mongoose.model('Fee', FeeSchema);
