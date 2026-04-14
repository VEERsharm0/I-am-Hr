const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // Full-time, Contract, etc.
  experienceLevel: { type: String, required: true },
  location: { type: String, required: true },
  workSetup: { type: String, default: 'On-site' },
  minSalary: { type: Number },
  maxSalary: { type: Number },
  description: { type: String, required: true },
  skills: { type: [String], default: [] },
  status: { type: String, default: 'Active' },
  recruiterId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  companyName: { type: String, default: 'Company Name' }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
