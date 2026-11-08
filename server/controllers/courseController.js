const Course = require('../models/Course');

exports.getAll = async (req, res) => {
  try {
    const { department, semester, faculty } = req.query;
    let filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = semester;
    if (faculty) filter.faculty = faculty;
    
    const courses = await Course.find(filter).populate('department', 'name code').populate('faculty', 'name email');
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('department', 'name code').populate('faculty', 'name email');
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
    res.status(200).json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
    res.status(200).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getByFaculty = async (req, res) => {
  try {
    const courses = await Course.find({ faculty: req.params.facultyId }).populate('department', 'name code');
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getByStudent = async (req, res) => {
  try {
    const courses = await Course.find({ department: req.user.department, semester: req.user.semester }).populate('faculty', 'name');
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
