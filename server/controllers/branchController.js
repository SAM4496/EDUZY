const Branch = require('../models/Branch');

// GET /api/branches - List branches for current institute
exports.getAll = async (req, res) => {
  try {
    const branches = await Branch.find({ institute: req.instituteId, isActive: true })
      .sort('name');
    res.json({ success: true, count: branches.length, data: branches });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/branches/:id
exports.getById = async (req, res) => {
  try {
    const branch = await Branch.findOne({ _id: req.params.id, institute: req.instituteId });
    if (!branch) return res.status(404).json({ success: false, error: 'Branch not found' });
    res.json({ success: true, data: branch });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/branches
exports.create = async (req, res) => {
  try {
    const branch = await Branch.create({
      ...req.body,
      institute: req.instituteId
    });
    res.status(201).json({ success: true, data: branch });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: 'Branch code already exists in this institute' });
    }
    res.status(400).json({ success: false, error: err.message });
  }
};

// PUT /api/branches/:id
exports.update = async (req, res) => {
  try {
    const branch = await Branch.findOneAndUpdate(
      { _id: req.params.id, institute: req.instituteId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!branch) return res.status(404).json({ success: false, error: 'Branch not found' });
    res.json({ success: true, data: branch });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE /api/branches/:id
exports.delete = async (req, res) => {
  try {
    const branch = await Branch.findOneAndDelete({ _id: req.params.id, institute: req.instituteId });
    if (!branch) return res.status(404).json({ success: false, error: 'Branch not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
