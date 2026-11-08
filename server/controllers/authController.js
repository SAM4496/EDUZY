const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// POST /api/auth/login - Login with email/userId + password + optional role validation
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email/userId and password' });
    }

    // Find user by email OR userId
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { userId: email }]
    })
      .select('+password')
      .populate('institute', 'name code')
      .populate('branch', 'name code')
      .populate('field', 'name code')
      .populate('department', 'name code');

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, error: 'Invalid credentials or account disabled' });
    }

    // If a specific role was requested (from role-specific login page), validate it
    if (role && user.role !== role) {
      return res.status(401).json({ success: false, error: `This account is not registered as ${role}. Please use the correct portal.` });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({ 
      success: true, 
      token, 
      user: userData,
      mustChangePassword: user.mustChangePassword
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/auth/me - Get current user with all populated refs
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('institute', 'name code contactEmail contactPhone address city state pincode isSetupComplete')
      .populate('branch', 'name code')
      .populate('field', 'name code')
      .populate('department', 'name code');
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/auth/profile - Update own profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, emergencyContact, avatar, qualification, specialization, officeRoom } = req.body;
    
    const user = await User.findByIdAndUpdate(req.user.id, {
      name, phone, address, emergencyContact, avatar, qualification, specialization, officeRoom
    }, { new: true, runValidators: true })
      .populate('institute', 'name code')
      .populate('branch', 'name code')
      .populate('field', 'name code')
      .populate('department', 'name code');
    
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id).select('+password');
    
    // For users with mustChangePassword, oldPassword might be the temp password
    if (!(await user.matchPassword(oldPassword))) {
      return res.status(401).json({ success: false, error: 'Incorrect current password' });
    }
    
    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();
    
    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// NOTE: register endpoint REMOVED - no self-registration
// Users are created by Admin via /api/users
