const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple null/undefined values
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
        match: [
            /^\+?[1-9]\d{1,14}$/,
            'Please add a valid phone number'
        ]
    },
    aadhar: {
        type: String,
        unique: true,
        sparse: true,
        match: [
            /^\d{12}$/,
            'Please add a valid 12-digit Aadhar number'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['Citizen', 'Doctor', 'Admin'],
        default: 'Citizen'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure either email, phone, or aadhar is provided
userSchema.pre('validate', function() {
    if (!this.email && !this.phone && !this.aadhar) {
        this.invalidate('email', 'You must provide either an email, phone number, or Aadhar number');
        this.invalidate('phone', 'You must provide either an email, phone number, or Aadhar number');
        this.invalidate('aadhar', 'You must provide either an email, phone number, or Aadhar number');
    }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
