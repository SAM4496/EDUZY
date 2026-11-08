const express = require('express');
const router = express.Router();
const { markAttendance, getByCourseDateRange, getStudentAttendance, getStudentCourseAttendance, getAttendanceStats, getCourseAttendanceForDate } = require('../controllers/attendanceController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.post('/mark', auth, roleGuard('admin', 'faculty'), markAttendance);
router.get('/course/:courseId', auth, getByCourseDateRange);
router.get('/course/:courseId/date/:date', auth, roleGuard('admin', 'faculty'), getCourseAttendanceForDate);
router.get('/student/:studentId', auth, getStudentAttendance);
router.get('/student/:studentId/course/:courseId', auth, getStudentCourseAttendance);
router.get('/stats/:courseId', auth, getAttendanceStats);

module.exports = router;
