const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
    name: String,
    relation: String,
    phone: String
});

const healthProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    age: {
        type: Number
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    },
    allergies: {
        type: [String],
        default: []
    },
    chronicDiseases: {
        type: [String],
        default: []
    },
    emergencyContacts: {
        type: [emergencyContactSchema],
        default: []
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('HealthProfile', healthProfileSchema);
