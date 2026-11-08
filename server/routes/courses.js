const express = require('express');
const router = express.Router();
const { getAll, getById, getByFaculty, getByStudent, create, update, delete: deleteCourse } = require('../controllers/courseController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.get('/', auth, getAll);
router.get('/faculty/:facultyId', auth, getByFaculty);
router.get('/student/my-courses', auth, roleGuard('student'), getByStudent);
router.get('/:id', auth, getById);
router.post('/', auth, roleGuard('admin'), create);
router.put('/:id', auth, roleGuard('admin'), update);
router.delete('/:id', auth, roleGuard('admin'), deleteCourse);

module.exports = router;
