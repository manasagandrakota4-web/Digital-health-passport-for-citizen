const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please add a title (e.g., Blood Test Report, Prescription)']
    },
    description: {
        type: String,
        required: [true, 'Please add a description or diagnosis']
    },
    recordType: {
        type: String,
        enum: ['Prescription', 'Lab Report', 'Vaccination', 'Treatment History', 'Other'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    document: {
        type: String // File path or URL
    }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
