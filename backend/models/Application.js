const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  recruiterId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  seekerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
  applicantPhone: { type: String },
  coverLetter: { type: String },
  status: { 
    type: String, 
    default: 'Pending',
    enum: ['Pending', 'Interviewing', 'Rejected', 'Hired'] 
  },
  matchScore: { type: Number, default: 0 } // Random score generated on post
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
