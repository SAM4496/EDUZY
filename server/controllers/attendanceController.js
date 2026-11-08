const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const mongoose = require('mongoose');

exports.markAttendance = async (req, res) => {
  try {
    const { courseId, date, records } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
    
    const attendanceOps = records.map(record => ({
      updateOne: {
        filter: { course: courseId, student: record.student, date: new Date(date) },
        update: { $set: { status: record.status, faculty: req.user.id, markedAt: new Date() } },
        upsert: true
      }
    }));
    
    await Attendance.bulkWrite(attendanceOps);
    res.status(200).json({ success: true, message: 'Attendance marked successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getByCourseDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const courseId = req.params.courseId;
    let query = { course: courseId };
    
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const attendance = await Attendance.find(query).populate('student', 'name enrollmentNo').sort({ date: 1 });
    res.status(200).json({ success: true, count: attendance.length, data: attendance });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.params.studentId })
      .populate('course', 'name code').sort({ date: -1 });
    res.status(200).json({ success: true, count: attendance.length, data: attendance });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getStudentCourseAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ 
      student: req.params.studentId, 
      course: req.params.courseId 
    }).sort({ date: 1 });
    res.status(200).json({ success: true, count: attendance.length, data: attendance });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAttendanceStats = async (req, res) => {
  try {
    const stats = await Attendance.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(req.params.courseId) } },
      { $group: {
          _id: "$student",
          totalClasses: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } }
        }
      },
      { $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: "$studentInfo" },
      { $project: {
          studentId: "$_id",
          name: "$studentInfo.name",
          enrollmentNo: "$studentInfo.enrollmentNo",
          totalClasses: 1,
          present: 1,
          percentage: { $multiply: [{ $divide: ["$present", "$totalClasses"] }, 100] }
        }
      }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCourseAttendanceForDate = async (req, res) => {
  try {
    const { courseId, date } = req.params;
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0,0,0,0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23,59,59,999);
    
    const attendance = await Attendance.find({
      course: courseId,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).populate('student', 'name enrollmentNo');
    
    res.status(200).json({ success: true, data: attendance });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
