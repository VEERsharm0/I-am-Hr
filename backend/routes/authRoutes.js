const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email, full_name: user.fullName },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Please fill all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'This email is already registered.' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      role: role || 'seeker'
    });

    const token = generateToken(user);
    
    // Return user info similar to Supabase
    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        user_metadata: {
          role: user.role,
          full_name: user.fullName
        }
      },
      session: {
        access_token: token
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error during signup' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (role && user.role !== role) {
      return res.status(401).json({ error: `Email not registered as ${role === 'seeker' ? 'a Job Seeker' : 'an Employer'}.` });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        user_metadata: {
          role: user.role,
          full_name: user.fullName
        }
      },
      session: {
        access_token: token
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error during login' });
  }
});

// Update Profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { fullName, location } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = fullName || user.fullName;
      user.location = location || user.location;

      const updatedUser = await user.save();

      res.status(200).json({
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          user_metadata: {
            role: updatedUser.role,
            full_name: updatedUser.fullName,
            location: updatedUser.location
          }
        }
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error updating profile' });
  }
});

// Upload Avatar
router.post('/upload-avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.profileImage = imageUrl;
      await user.save();

      res.status(200).json({
        user: {
          id: user._id,
          email: user.email,
          user_metadata: {
            role: user.role,
            full_name: user.fullName,
            location: user.location,
            profile_image: user.profileImage
          }
        }
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error uploading avatar' });
  }
});

module.exports = router;
