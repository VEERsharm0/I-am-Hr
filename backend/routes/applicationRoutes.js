const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');

// @desc    Submit an application
// @route   POST /api/applications/:jobId
// @access  Private (Seeker only)
router.post('/:jobId', protect, async (req, res) => {
  try {
    if (req.user.role !== 'seeker') {
      return res.status(403).json({ error: 'Only job seekers can apply.' });
    }

    const { jobId } = req.params;
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Prevent duplicate applications
    const existingApplication = await Application.findOne({
      jobId,
      seekerId: req.user._id
    });
    
    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this job.' });
    }

    const { applicantName, applicantEmail, applicantPhone, coverLetter } = req.body;
    
    // Random match score 70-98 to simulate an AI parsing score for now
    const randomScore = Math.floor(Math.random() * (98 - 70 + 1) + 70);

    const application = await Application.create({
      jobId,
      recruiterId: job.recruiterId,
      seekerId: req.user._id,
      applicantName,
      applicantEmail,
      applicantPhone,
      coverLetter,
      matchScore: randomScore
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
});

// @desc    Get all applications by the logged-in seeker
// @route   GET /api/applications/seeker
// @access  Private (Seeker only)
router.get('/seeker', protect, async (req, res) => {
  try {
    if (req.user.role !== 'seeker') {
      return res.status(403).json({ error: 'Only job seekers can fetch their applications.' });
    }

    const applications = await Application.find({ seekerId: req.user._id })
      .populate('jobId', 'title companyName location type')
      .sort({ createdAt: -1 });
      
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Server Error retrieving applications' });
  }
});

// @desc    Get all applications across all jobs for the logged-in Employer
// @route   GET /api/applications/recruiter
// @access  Private (Employer only)
router.get('/recruiter', protect, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Only employers can view their applicants.' });
    }

    const applications = await Application.find({ recruiterId: req.user._id })
      .populate('jobId', 'title companyName')
      .sort({ createdAt: -1 });
      
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Server Error retrieving applications' });
  }
});

// @desc    Get all applications for a specific job (Employer side)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
router.get('/job/:jobId', protect, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Only employers can view job applicants.' });
    }

    const { jobId } = req.params;

    // Verify ownership of the job
    const job = await Job.findById(jobId);
    if (!job || job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Job not found or unauthorized access' });
    }

    const applications = await Application.find({ jobId }).sort({ matchScore: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Server Error retrieving applications' });
  }
});

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private (Employer only)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Only employers can modify statuses.' });
    }

    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to modify this application.' });
    }

    application.status = status;
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Server Error updating application' });
  }
});

module.exports = router;
