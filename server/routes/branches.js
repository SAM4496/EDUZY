const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, delete: deleteBranch } = require('../controllers/branchController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const instituteScope = require('../middleware/instituteScope');

router.use(auth, roleGuard('admin'), instituteScope);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', deleteBranch);

module.exports = router;
