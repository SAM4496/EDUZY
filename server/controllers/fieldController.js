const Field = require('../models/Field');

// GET /api/fields - List fields for current institute
exports.getAll = async (req, res) => {
  try {
    const fields = await Field.find({ institute: req.instituteId, isActive: true })
      .sort('name');
    res.json({ success: true, count: fields.length, data: fields });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/fields/:id
exports.getById = async (req, res) => {
  try {
    const field = await Field.findOne({ _id: req.params.id, institute: req.instituteId });
    if (!field) return res.status(404).json({ success: false, error: 'Field not found' });
    res.json({ success: true, data: field });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/fields
exports.create = async (req, res) => {
  try {
    const field = await Field.create({
      ...req.body,
      institute: req.instituteId
    });
    res.status(201).json({ success: true, data: field });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: 'Field code already exists in this institute' });
    }
    res.status(400).json({ success: false, error: err.message });
  }
};

// PUT /api/fields/:id
exports.update = async (req, res) => {
  try {
    const field = await Field.findOneAndUpdate(
      { _id: req.params.id, institute: req.instituteId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!field) return res.status(404).json({ success: false, error: 'Field not found' });
    res.json({ success: true, data: field });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE /api/fields/:id
exports.delete = async (req, res) => {
  try {
    const field = await Field.findOneAndDelete({ _id: req.params.id, institute: req.instituteId });
    if (!field) return res.status(404).json({ success: false, error: 'Field not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
