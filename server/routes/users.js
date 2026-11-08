const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, delete: deleteUser, getFaculty, getStudents, resetPassword } = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const instituteScope = require('../middleware/instituteScope');

// All routes require auth + admin + institute scope
router.use(auth, roleGuard('admin'), instituteScope);

router.get('/', getAll);
router.get('/faculty', getFaculty);
router.get('/students', getStudents);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', deleteUser);
router.post('/:id/reset-password', resetPassword);

module.exports = router;
