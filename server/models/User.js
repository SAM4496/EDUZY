const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // Multi-tenant references
  institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute' },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field' },

  // Auto-generated unique ID (e.g. ADM-2024-001, FAC-2024-001, STU-2024-001)
  userId: { type: String, unique: true, sparse: true, trim: true },

  // Basic info
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['super_admin', 'admin', 'faculty', 'student'], required: true },
  phone: { type: String, trim: true },
  avatar: { type: String },

  // Faculty-specific
  employeeId: { type: String, trim: true },
  qualification: { type: String, trim: true },
  specialization: { type: String, trim: true },
  experience: { type: Number },
  officeRoom: { type: String, trim: true },

  // Student-specific
  enrollmentNo: { type: String, trim: true },
  semester: { type: Number, min: 1, max: 8 },
  cgpa: { type: Number },

  // Shared optional fields
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  address: { type: String, trim: true },
  dateOfBirth: { type: Date },
  bloodGroup: { type: String, trim: true },
  emergencyContact: { type: String, trim: true },

  // Auth flags
  mustChangePassword: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Email unique within institute+role scope (allow same email across different institutes)
UserSchema.index({ email: 1, institute: 1 }, { unique: true });

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Static method to generate unique userId
UserSchema.statics.generateUserId = async function (role, institute) {
  const prefixMap = { admin: 'ADM', faculty: 'FAC', student: 'STU', super_admin: 'SYS' };
  const prefix = prefixMap[role] || 'USR';
  const year = new Date().getFullYear();

  // Count existing users of this role in this institute to get next sequence
  const query = { role };
  if (institute) query.institute = institute;

  const count = await this.countDocuments(query);
  const seq = String(count + 1).padStart(4, '0');

  return `${prefix}-${year}-${seq}`;
};

// Static method to generate secure temp password
UserSchema.statics.generateTempPassword = function () {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const specials = '@#$!';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Add one special char and one number for security
  password += specials.charAt(Math.floor(Math.random() * specials.length));
  password += Math.floor(Math.random() * 10);
  return password;
};

module.exports = mongoose.model('User', UserSchema);
