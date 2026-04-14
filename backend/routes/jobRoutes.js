const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Recruiter only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Only employers/recruiters can post jobs' });
    }

    const job = await Job.create({
      ...req.body,
      recruiterId: req.user._id,
      companyName: req.user.fullName // Falling back to full name if no specialized company
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
});

// @desc    Get jobs posted by the logged-in recruiter
// @route   GET /api/jobs/recruiter
// @access  Private (Recruiter only)
router.get('/recruiter', protect, async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Server Error retrieving jobs' });
  }
});

// @desc    Get all jobs (for Job seekers)
// @route   GET /api/jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Server Error retrieving algorithms' });
  }
});

module.exports = router;
