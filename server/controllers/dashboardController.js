const User = require('../models/User');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Fee = require('../models/Fee');
const Attendance = require('../models/Attendance');

exports.adminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const totalDepartments = await Department.countDocuments();
    const totalCourses = await Course.countDocuments();
    
    // Fee collection stats
    const fees = await Fee.aggregate([
      { $group: { _id: null, totalCollected: { $sum: "$paid" }, totalPending: { $sum: "$balance" } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalFaculty,
        totalDepartments,
        totalCourses,
        fees: fees[0] || { totalCollected: 0, totalPending: 0 }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.facultyStats = async (req, res) => {
  try {
    const coursesTeaching = await Course.find({ faculty: req.user.id });
    const courseIds = coursesTeaching.map(c => c._id);
    
    const studentsInvolved = await User.countDocuments({
      role: 'student',
      $or: coursesTeaching.map(c => ({ department: c.department, semester: c.semester }))
    });
    
    const activeAssignments = await Assignment.countDocuments({ faculty: req.user.id, isActive: true });
    
    res.status(200).json({
      success: true,
      data: {
        coursesTeaching: coursesTeaching.length,
        totalStudents: studentsInvolved,
        activeAssignments
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.studentStats = async (req, res) => {
  try {
    const enrolledCourses = await Course.countDocuments({ department: req.user.department, semester: req.user.semester });
    
    // Attendance %
    const attendanceStats = await Attendance.aggregate([
      { $match: { student: req.user._id } },
      { $group: { _id: null, totalClasses: { $sum: 1 }, present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } } } }
    ]);
    
    const attendancePercent = attendanceStats.length > 0 && attendanceStats[0].totalClasses > 0 
      ? Math.round((attendanceStats[0].present / attendanceStats[0].totalClasses) * 100) 
      : 0;
      
    // Fee status
    const feeRecords = await Fee.find({ student: req.user.id, status: { $ne: 'paid' } });
    const pendingFees = feeRecords.reduce((acc, curr) => acc + curr.balance, 0);

    // Get assignments for student's courses
    const courses = await Course.find({ department: req.user.department, semester: req.user.semester });
    const pendingAssignments = await Assignment.countDocuments({ course: { $in: courses.map(c => c._id) }, isActive: true });

    res.status(200).json({
      success: true,
      data: {
        enrolledCourses,
        attendancePercent,
        pendingFees,
        pendingAssignments
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
