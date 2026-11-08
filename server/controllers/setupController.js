const Institute = require('../models/Institute');
const Branch = require('../models/Branch');
const Field = require('../models/Field');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// GET /api/setup/status - Check if any institute exists (public)
exports.getStatus = async (req, res) => {
  try {
    const count = await Institute.countDocuments();
    res.json({
      success: true,
      data: {
        hasInstitutes: count > 0,
        isFirstTime: count === 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/setup/institute - Create institute + branches + fields + admin (public, first-time only)
exports.setupInstitute = async (req, res) => {
  try {
    const { institute, branches, fields, admin } = req.body;

    // Validate required sections
    if (!institute || !institute.name || !institute.code) {
      return res.status(400).json({ success: false, error: 'Institute name and code are required' });
    }
    if (!admin || !admin.name || !admin.email || !admin.password) {
      return res.status(400).json({ success: false, error: 'Admin name, email, and password are required' });
    }
    if (admin.password.length < 6) {
      return res.status(400).json({ success: false, error: 'Admin password must be at least 6 characters' });
    }

    // Check if institute code already exists
    const existingInstitute = await Institute.findOne({ code: institute.code.toUpperCase() });
    if (existingInstitute) {
      return res.status(400).json({ success: false, error: 'Institute code already exists' });
    }

    // 1. Create Institute
    const newInstitute = await Institute.create({
      name: institute.name,
      code: institute.code.toUpperCase(),
      contactEmail: institute.contactEmail || '',
      contactPhone: institute.contactPhone || '',
      address: institute.address || '',
      city: institute.city || '',
      state: institute.state || '',
      pincode: institute.pincode || '',
      isSetupComplete: false
    });

    // 2. Create Branches (if provided)
    const createdBranches = [];
    if (branches && Array.isArray(branches) && branches.length > 0) {
      for (const branch of branches) {
        if (branch.name && branch.code) {
          const b = await Branch.create({
            institute: newInstitute._id,
            name: branch.name,
            code: branch.code.toUpperCase(),
            address: branch.address || ''
          });
          createdBranches.push(b);
        }
      }
    }

    // 3. Create Fields (if provided)
    const createdFields = [];
    if (fields && Array.isArray(fields) && fields.length > 0) {
      for (const field of fields) {
        if (field.name && field.code) {
          const f = await Field.create({
            institute: newInstitute._id,
            name: field.name,
            code: field.code.toUpperCase(),
            description: field.description || '',
            type: field.type || 'other'
          });
          createdFields.push(f);
        }
      }
    }

    // 4. Create Admin User
    const adminUserId = await User.generateUserId('admin', newInstitute._id);
    const adminUser = await User.create({
      institute: newInstitute._id,
      userId: adminUserId,
      name: admin.name,
      email: admin.email.toLowerCase(),
      password: admin.password,
      role: 'admin',
      phone: admin.phone || '',
      mustChangePassword: false
    });

    // 5. Mark setup as complete
    newInstitute.isSetupComplete = true;
    await newInstitute.save();

    // 6. Generate JWT token for immediate login
    const token = jwt.sign(
      { id: adminUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        institute: newInstitute,
        branches: createdBranches,
        fields: createdFields,
        admin: {
          _id: adminUser._id,
          userId: adminUser.userId,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role
        },
        token
      }
    });
  } catch (err) {
    // Cleanup on failure
    res.status(500).json({ success: false, error: err.message });
  }
};
