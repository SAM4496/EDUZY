const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, delete: deleteDept } = require('../controllers/departmentController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.get('/', auth, getAll);
router.get('/:id', auth, getById);
router.post('/', auth, roleGuard('admin'), create);
router.put('/:id', auth, roleGuard('admin'), update);
router.delete('/:id', auth, roleGuard('admin'), deleteDept);

module.exports = router;
