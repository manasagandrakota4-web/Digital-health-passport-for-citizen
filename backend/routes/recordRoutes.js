const express = require('express');
const { getRecords, addRecord, getPatientRecords } = require('../controllers/recordController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Get own records and Create new record
router.route('/')
    .get(protect, getRecords)
    .post(protect, upload.single('document'), addRecord);

// Doctor or Admin can get a specific patient's records
router.route('/patient/:patientId')
    .get(protect, authorize('Doctor', 'Admin'), getPatientRecords);

module.exports = router;
