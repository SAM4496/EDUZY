const express = require('express');
const router = express.Router();
const { submit, getByAssignment, getByStudent, grade } = require('../controllers/submissionController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.post('/', auth, roleGuard('student'), submit);
router.get('/assignment/:assignmentId', auth, roleGuard('admin', 'faculty'), getByAssignment);
router.get('/student/my-submissions', auth, roleGuard('student'), getByStudent);
router.put('/:id/grade', auth, roleGuard('admin', 'faculty'), grade);

module.exports = router;
