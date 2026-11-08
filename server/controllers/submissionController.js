const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');

exports.submit = async (req, res) => {
  try {
    req.body.student = req.user.id;
    const { assignment } = req.body;
    
    const assignmentExists = await Assignment.findById(assignment);
    if (!assignmentExists) return res.status(404).json({ success: false, error: 'Assignment not found' });
    
    let submission = await Submission.findOne({ assignment, student: req.user.id });
    
    if (submission) {
      submission = await Submission.findByIdAndUpdate(submission._id, { files: req.body.files, submittedAt: Date.now() }, { new: true });
    } else {
      submission = await Submission.create(req.body);
    }
    
    res.status(201).json({ success: true, data: submission });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getByAssignment = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.assignmentId })
      .populate('student', 'name enrollmentNo avatar').sort({ submittedAt: -1 });
    res.status(200).json({ success: true, count: submissions.length, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getByStudent = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user.id })
      .populate('assignment', 'title course dueDate totalPoints');
    res.status(200).json({ success: true, count: submissions.length, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.grade = async (req, res) => {
  try {
    const { score, grade, feedback } = req.body;
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ success: false, error: 'Submission not found' });
    
    submission.score = score;
    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'graded';
    await submission.save();
    
    res.status(200).json({ success: true, data: submission });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
