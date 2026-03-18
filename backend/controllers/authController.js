const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { name, email, phone, aadhar, password, role } = req.body;

        if (!email && !phone && !aadhar) {
            return res.status(400).json({ success: false, message: 'Please provide either an email, phone, or Aadhar number' });
        }

        const query = [];
        if (email) query.push({ email });
        if (phone) query.push({ phone });
        if (aadhar) query.push({ aadhar });

        const userExists = await User.findOne({ $or: query });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists with that email, phone, or Aadhar' });
        }

        const userData = { name, password, role };
        if (email) userData.email = email;
        if (phone) userData.phone = phone;
        if (aadhar) userData.aadhar = aadhar;

        const user = await User.create(userData);

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                aadhar: user.aadhar,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body; 

        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email/phone/Aadhar and password' });
        }

        const user = await User.findOne({ 
            $or: [
                { email: identifier },
                { phone: identifier },
                { aadhar: identifier }
            ] 
        }).select('+password');
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        res.status(200).json({
            success: true,
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                aadhar: user.aadhar,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
