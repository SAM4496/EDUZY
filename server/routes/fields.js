const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, delete: deleteField } = require('../controllers/fieldController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const instituteScope = require('../middleware/instituteScope');

router.use(auth, roleGuard('admin'), instituteScope);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', deleteField);

module.exports = router;
