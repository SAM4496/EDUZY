const Fee = require('../models/Fee');

exports.getAll = async (req, res) => {
  try {
    const { status, semester, academicYear } = req.query;
    let query = {};
    if (status) query.status = status;
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;
    
    const fees = await Fee.find(query).populate('student', 'name enrollmentNo department').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: fees.length, data: fees });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getByStudent = async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.user.id }).sort({ semester: -1 });
    res.status(200).json({ success: true, count: fees.length, data: fees });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json({ success: true, data: fee });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ success: false, error: 'Fee record not found' });
    
    Object.assign(fee, req.body);
    await fee.save();
    
    res.status(200).json({ success: true, data: fee });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.recordPayment = async (req, res) => {
  try {
    const { amount, receiptNo } = req.body;
    let fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ success: false, error: 'Fee record not found' });
    
    fee.paid += Number(amount);
    fee.receiptNo = receiptNo;
    fee.paidDate = Date.now();
    await fee.save();
    
    res.status(200).json({ success: true, data: fee });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
