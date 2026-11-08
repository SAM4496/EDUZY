const Assignment = require('../models/Assignment');
const Course = require('../models/Course');

exports.getAll = async (req, res) => {
  try {
    const { course, faculty, status } = req.query;
    let query = {};
    if (course) query.course = course;
    if (faculty) query.faculty = faculty;
    if (status !== undefined) query.isActive = status === 'active';
    
    const assignments = await Assignment.find(query).populate('course', 'name code').populate('faculty', 'name').sort({ dueDate: 1 });
    res.status(200).json({ success: true, count: assignments.length, data: assignments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('course', 'name code').populate('faculty', 'name');
    if (!assignment) return res.status(404).json({ success: false, error: 'Assignment not found' });
    res.status(200).json({ success: true, data: assignment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    req.body.faculty = req.user.id;
    const assignment = await Assignment.create(req.body);
    res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, error: 'Assignment not found' });
    
    if (assignment.faculty.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to update this assignment' });
    }
    
    assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: assignment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    let assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, error: 'Assignment not found' });
    
    if (assignment.faculty.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this assignment' });
    }
    
    await assignment.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getByStudent = async (req, res) => {
  try {
    const courses = await Course.find({ department: req.user.department, semester: req.user.semester });
    const courseIds = courses.map(c => c._id);
    
    const assignments = await Assignment.find({ course: { $in: courseIds }, isActive: true })
      .populate('course', 'name code').populate('faculty', 'name').sort({ dueDate: 1 });
    res.status(200).json({ success: true, count: assignments.length, data: assignments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
