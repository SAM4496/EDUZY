const Result = require('../models/Result');

exports.getAll = async (req, res) => {
  try {
    const { semester, academicYear, course } = req.query;
    let query = {};
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;
    if (course) query.course = course;
    
    const results = await Result.find(query)
      .populate('student', 'name enrollmentNo')
      .populate('course', 'name code').sort({ semester: -1 });
    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getByStudent = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user.id })
      .populate('course', 'name code credits').sort({ semester: -1 });
    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const result = await Result.create(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ success: false, error: 'Result not found' });
    
    Object.assign(result, req.body);
    await result.save();
    
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getSemesterResults = async (req, res) => {
  try {
    const studentId = req.user.role === 'student' ? req.user.id : req.query.studentId;
    if (!studentId) return res.status(400).json({ success: false, error: 'Student ID required' });
    
    const results = await Result.find({ student: studentId, semester: req.params.semester })
      .populate('course', 'name code credits');
      
    // Calculate SGPA
    let totalCredits = 0;
    let earnedPoints = 0;
    results.forEach(r => {
      totalCredits += r.course.credits;
      earnedPoints += (r.course.credits * r.gradePoints);
    });
    const sgpa = totalCredits > 0 ? (earnedPoints / totalCredits).toFixed(2) : 0;
    
    res.status(200).json({ success: true, count: results.length, sgpa, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
