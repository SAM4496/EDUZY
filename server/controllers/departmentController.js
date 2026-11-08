const Department = require('../models/Department');
const User = require('../models/User');

exports.getAll = async (req, res) => {
  try {
    const query = {};
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { code: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    const departments = await Department.find(query).populate('hod', 'name email').populate('facultyCount').populate('studentCount');
    res.status(200).json({ success: true, count: departments.length, data: departments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('hod', 'name email').populate('facultyCount').populate('studentCount');
    if (!department) return res.status(404).json({ success: false, error: 'Department not found' });
    res.status(200).json({ success: true, data: department });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({ success: true, data: department });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!department) return res.status(404).json({ success: false, error: 'Department not found' });
    res.status(200).json({ success: true, data: department });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const usersInDept = await User.countDocuments({ department: req.params.id });
    if (usersInDept > 0) {
      return res.status(400).json({ success: false, error: 'Cannot delete department with assigned users' });
    }
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ success: false, error: 'Department not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
