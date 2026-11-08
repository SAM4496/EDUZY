const express = require('express');
const router = express.Router();
const { getAll, getById, getByStudent, create, update, delete: deleteAssignment } = require('../controllers/assignmentController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.get('/', auth, getAll);
router.get('/student/my-assignments', auth, roleGuard('student'), getByStudent);
router.get('/:id', auth, getById);
router.post('/', auth, roleGuard('admin', 'faculty'), create);
router.put('/:id', auth, roleGuard('admin', 'faculty'), update);
router.delete('/:id', auth, roleGuard('admin', 'faculty'), deleteAssignment);

module.exports = router;
