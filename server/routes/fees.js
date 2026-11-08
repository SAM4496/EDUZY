const express = require('express');
const router = express.Router();
const { getAll, getByStudent, create, update, recordPayment } = require('../controllers/feeController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.get('/', auth, roleGuard('admin'), getAll);
router.get('/student/my-fees', auth, roleGuard('student'), getByStudent);
router.post('/', auth, roleGuard('admin'), create);
router.put('/:id', auth, roleGuard('admin'), update);
router.put('/:id/payment', auth, roleGuard('admin'), recordPayment);

module.exports = router;
