const HealthProfile = require('../models/HealthProfile');
const User = require('../models/User');
const mongoose = require('mongoose');

const getPatientId = async (idOrString) => {
    if (!idOrString) return null;
    if (mongoose.isValidObjectId(idOrString)) return idOrString;
    const user = await User.findOne({
        $or: [
            { email: idOrString },
            { phone: idOrString },
            { aadhar: idOrString },
            { name: { $regex: new RegExp(`^${idOrString}$`, 'i') } }
        ]
    });
    return user ? user._id : null;
};

// @desc    Get current user's health profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const profile = await HealthProfile.findOne({ user: req.user.id }).populate('user', 'name email');
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create or update user's health profile
// @route   POST /api/profile
// @access  Private
exports.upsertProfile = async (req, res) => {
    try {
        const { age, bloodGroup, allergies, chronicDiseases, emergencyContacts } = req.body;

        const profileFields = {
            user: req.user.id,
            age,
            bloodGroup,
            allergies,
            chronicDiseases,
            emergencyContacts
        };

        let profile = await HealthProfile.findOne({ user: req.user.id });

        if (profile) {
            // Update
            profile = await HealthProfile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields, updatedAt: Date.now() },
                { new: true }
            );
            return res.status(200).json({ success: true, data: profile });
        }

        // Create
        profile = await HealthProfile.create(profileFields);
        res.status(201).json({ success: true, data: profile });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get a user's health profile by ID (For Doctors or Emergency)
// @route   GET /api/profile/user/:userId
// @access  Private/Public(Emergency)
exports.getProfileByUserId = async (req, res) => {
    try {
        const finalUserId = await getPatientId(req.params.userId);
        if (!finalUserId) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const profile = await HealthProfile.findOne({ user: finalUserId }).populate('user', 'name email');
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
