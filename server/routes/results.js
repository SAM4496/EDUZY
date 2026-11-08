const express = require('express');
const router = express.Router();
const { getAll, getByStudent, getSemesterResults, create, update } = require('../controllers/resultController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.get('/', auth, roleGuard('admin'), getAll);
router.get('/student/my-results', auth, roleGuard('student'), getByStudent);
router.get('/semester/:semester', auth, getSemesterResults);
router.post('/', auth, roleGuard('admin', 'faculty'), create);
router.put('/:id', auth, roleGuard('admin', 'faculty'), update);

module.exports = router;
