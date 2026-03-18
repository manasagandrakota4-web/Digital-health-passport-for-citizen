const MedicalRecord = require('../models/MedicalRecord');
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

// @desc    Get all medical records for current user
// @route   GET /api/records
// @access  Private (Citizen)
exports.getRecords = async (req, res) => {
    try {
        const records = await MedicalRecord.find({ patient: req.user.id })
            .populate('doctor', 'name email')
            .sort({ date: -1 });
        res.status(200).json({ success: true, count: records.length, data: records });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add a medical record
// @route   POST /api/records
// @access  Private (Citizen or Doctor)
exports.addRecord = async (req, res) => {
    try {
        const { title, description, recordType, patientId } = req.body;

        let finalPatientId = req.user.id;
        if (req.user.role === 'Doctor' || req.user.role === 'Admin') {
            if (!patientId) {
                return res.status(400).json({ success: false, message: 'Please provide a patient Aadhar, ID, email, or name' });
            }
            finalPatientId = await getPatientId(patientId);
            
            // If patient doesn't exist AND we have details to create them
            if (!finalPatientId && req.body.newPatientName) {
                const isAadhar = /^\d{12}$/.test(patientId);
                const isPhone = /^\+?[1-9]\d{1,14}$/.test(patientId);
                
                if (!isAadhar && !isPhone) {
                     return res.status(400).json({ success: false, message: 'To create a new patient, the Patient ID must be a valid 12-digit Aadhar number or a valid Phone number' });
                }

                const newUserFields = {
                     name: req.body.newPatientName,
                     password: 'defaultPassword123!', // Automatically set a temporary password or generate one
                     role: 'Citizen'
                };
                
                if (isAadhar) {
                     newUserFields.aadhar = patientId;
                } else if (isPhone) {
                     newUserFields.phone = patientId;
                }

                if (req.body.newPatientPhone && isAadhar) newUserFields.phone = req.body.newPatientPhone;
                if (req.body.newPatientEmail) newUserFields.email = req.body.newPatientEmail;

                try {
                     const newUser = await User.create(newUserFields);
                     finalPatientId = newUser._id;
                } catch (createErr) {
                     console.error("User Creation Error:", createErr);
                     return res.status(400).json({ success: false, message: 'Failed to create new patient. Check if Email/Phone is already in use.', error: createErr.message });
                }
            } else if (!finalPatientId) {
                return res.status(404).json({ success: false, message: 'Patient not found. To register them, provide their Name and an Aadhar number.' });
            }
        }

        const recordFields = {
            title,
            description,
            recordType,
            patient: finalPatientId
        };

        if (req.file) {
            recordFields.document = `/uploads/${req.file.filename}`;
        }

        if (req.user.role === 'Doctor') {
            recordFields.doctor = req.user.id;
        }

        const record = await MedicalRecord.create(recordFields);
        res.status(201).json({ success: true, data: record });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get medical records for a specific patient
// @route   GET /api/records/patient/:patientId
// @access  Private (Doctor, Admin)
exports.getPatientRecords = async (req, res) => {
    try {
        const finalPatientId = await getPatientId(req.params.patientId);
        if (!finalPatientId) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        const records = await MedicalRecord.find({ patient: finalPatientId })
            .populate('doctor', 'name email')
            .sort({ date: -1 });
        res.status(200).json({ success: true, count: records.length, data: records });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
