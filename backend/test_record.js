const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testRecordCreation = async () => {
    try {
        // 1. Get a Doctor token first
        console.log('--- Registering a Test Doctor ---');
        let token;
        const uniquePhone = `+1${Math.floor(Math.random() * 1000000000)}`;
        try {
            const docRes = await axios.post(`${API_URL}/auth/register`, {
                name: 'Test Doctor',
                phone: uniquePhone,
                password: 'password123',
                role: 'Doctor'
            });
            token = docRes.data.token;
        } catch (err) {
            console.error(err.response?.data);
            return;
        }
        
        console.log('Got Doctor Token:', !!token);

        // 2. Try creating a completely new patient via Aadhar
        console.log('\n--- Creating Record for New Patient via Aadhar ---');
        const uniqueAadhar = '999988887777';
        try {
            const recRes = await axios.post(`${API_URL}/records`, {
                patientId: uniqueAadhar,
                newPatientName: 'Aadhar Test Patient',
                title: 'Initial Checkup',
                recordType: 'Prescription',
                description: 'Blood pressure and routine check'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ Success! Created new patient and record:', recRes.data.data.title);
        } catch (err) {
            console.error('❌ Failed to create new patient/record:', err.response?.data?.message || err.message);
            // Print full error for debugging
            if (err.response?.data) {
                console.error(err.response.data);
            }
        }

    } catch (error) {
        console.error('Test script failed completely:', error.message);
    }
};

testRecordCreation();
