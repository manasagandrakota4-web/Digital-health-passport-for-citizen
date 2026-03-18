const express = require('express');
const { getProfile, upsertProfile, getProfileByUserId } = require('../controllers/profileController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getProfile)
    .post(protect, upsertProfile);

// Public route for emergency access, or protected for Doctors
router.get('/user/:userId', getProfileByUserId);

module.exports = router;
