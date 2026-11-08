const User = require('../models/User');

// GET /api/users - List users (institute-scoped)
exports.getAll = async (req, res) => {
  try {
    const { role, department, branch, field, semester, isActive, search } = req.query;
    let query = {};
    
    // Scope to institute
    if (req.instituteId) query.institute = req.instituteId;
    
    if (role) query.role = role;
    if (department) query.department = department;
    if (branch) query.branch = branch;
    if (field) query.field = field;
    if (semester) query.semester = parseInt(semester);
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } }
      ];
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('department', 'name')
      .populate('branch', 'name code')
      .populate('field', 'name code')
      .skip(startIndex).limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      data: users
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/users/:id
exports.getById = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.instituteId) query.institute = req.instituteId;
    
    const user = await User.findOne(query)
      .populate('department', 'name code')
      .populate('branch', 'name code')
      .populate('field', 'name code')
      .populate('institute', 'name code');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/users - Admin creates a user (auto-generates userId + temp password)
exports.create = async (req, res) => {
  try {
    const { name, email, role, phone, department, branch, field, 
            semester, enrollmentNo, employeeId, qualification, specialization,
            address, dateOfBirth, bloodGroup } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ success: false, error: 'Name, email, and role are required' });
    }

    if (!['faculty', 'student'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Role must be faculty or student' });
    }

    // Check if email already exists within this institute
    const existing = await User.findOne({ email: email.toLowerCase(), institute: req.instituteId });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email already registered in this institute' });
    }

    // Auto-generate userId and temp password
    const userId = await User.generateUserId(role, req.instituteId);
    const tempPassword = User.generateTempPassword();

    const user = await User.create({
      institute: req.instituteId,
      userId,
      name,
      email: email.toLowerCase(),
      password: tempPassword,
      role,
      phone: phone || '',
      department: department || undefined,
      branch: branch || undefined,
      field: field || undefined,
      semester: semester || undefined,
      enrollmentNo: enrollmentNo || undefined,
      employeeId: employeeId || undefined,
      qualification: qualification || undefined,
      specialization: specialization || undefined,
      address: address || undefined,
      dateOfBirth: dateOfBirth || undefined,
      bloodGroup: bloodGroup || undefined,
      mustChangePassword: true
    });

    // Return user data WITH the temp password so admin can share it
    res.status(201).json({
      success: true,
      data: user,
      credentials: {
        userId: userId,
        email: user.email,
        tempPassword: tempPassword
      },
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created. Please share the credentials securely.`
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// PUT /api/users/:id - Admin updates user (institute-scoped)
exports.update = async (req, res) => {
  try {
    // Don't allow changing role, institute, or password via this endpoint
    const { password, role, institute, userId, ...updateData } = req.body;
    
    const query = { _id: req.params.id };
    if (req.instituteId) query.institute = req.instituteId;

    const user = await User.findOneAndUpdate(query, updateData, { new: true, runValidators: true })
      .populate('department', 'name')
      .populate('branch', 'name code')
      .populate('field', 'name code');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE /api/users/:id - Soft delete (deactivate)
exports.delete = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.instituteId) query.institute = req.instituteId;
    
    const user = await User.findOneAndUpdate(query, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/users/faculty - List faculty (institute-scoped)
exports.getFaculty = async (req, res) => {
  try {
    const query = { role: 'faculty' };
    if (req.instituteId) query.institute = req.instituteId;
    
    const faculty = await User.find(query)
      .populate('department', 'name')
      .populate('branch', 'name code')
      .populate('field', 'name code');
    res.status(200).json({ success: true, count: faculty.length, data: faculty });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/users/students - List students (institute-scoped)
exports.getStudents = async (req, res) => {
  try {
    const query = { role: 'student' };
    if (req.instituteId) query.institute = req.instituteId;
    
    const { department, branch, field, semester } = req.query;
    if (department) query.department = department;
    if (branch) query.branch = branch;
    if (field) query.field = field;
    if (semester) query.semester = parseInt(semester);

    const students = await User.find(query)
      .populate('department', 'name')
      .populate('branch', 'name code')
      .populate('field', 'name code');
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/users/:id/reset-password - Admin resets a user's password
exports.resetPassword = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.instituteId) query.institute = req.instituteId;

    const user = await User.findOne(query).select('+password');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    const newTempPassword = User.generateTempPassword();
    user.password = newTempPassword;
    user.mustChangePassword = true;
    await user.save();

    res.status(200).json({
      success: true,
      credentials: {
        userId: user.userId,
        email: user.email,
        tempPassword: newTempPassword
      },
      message: 'Password reset. Please share the new credentials securely.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
