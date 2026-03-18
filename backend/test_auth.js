const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testAuth = async () => {
    try {
        console.log('--- Testing Email Registration ---');
        let emailRes;
        try {
            emailRes = await axios.post(`${API_URL}/auth/register`, {
                name: 'Test Email User',
                email: 'testemail2024@example.com',
                password: 'password123',
                role: 'Citizen'
            });
            console.log('✅ Email Registration Success:', emailRes.data.user.email);
        } catch (err) {
            console.log('⚠️ Expected Error (User might exist):', err.response?.data?.message);
        }

        console.log('\n--- Testing Email Login ---');
        try {
            const loginEmailRes = await axios.post(`${API_URL}/auth/login`, {
                identifier: 'testemail2024@example.com',
                password: 'password123'
            });
            console.log('✅ Email Login Success. Token Received:', !!loginEmailRes.data.token);
        } catch (err) {
            console.error('❌ Email Login Failed:', err.response?.data?.message || err.message);
        }

        console.log('\n--- Testing Phone Registration ---');
        let phoneRes;
        try {
            phoneRes = await axios.post(`${API_URL}/auth/register`, {
                name: 'Test Phone User',
                phone: '+19998887777',
                password: 'password123',
                role: 'Citizen'
            });
            console.log('✅ Phone Registration Success:', phoneRes.data.user.phone);
        } catch (err) {
            console.log('⚠️ Expected Error (User might exist):', err.response?.data?.message);
        }

        console.log('\n--- Testing Phone Login ---');
        try {
            const loginPhoneRes = await axios.post(`${API_URL}/auth/login`, {
                identifier: '+19998887777',
                password: 'password123'
            });
            console.log('✅ Phone Login Success. Token Received:', !!loginPhoneRes.data.token);
        } catch (err) {
            console.error('❌ Phone Login Failed:', err.response?.data?.message || err.message);
        }

        console.log('\n--- Testing Invalid Registration (No Email/Phone) ---');
        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: 'No Info User',
                password: 'password123',
                role: 'Citizen'
            });
            console.log('❌ Failed: Should have rejected registration with no email or phone');
        } catch (err) {
            console.log('✅ Registration rejected successfully:', err.response?.data?.message);
        }

    } catch (error) {
        console.error('Test script failed completely:', error.message);
    }
};

testAuth();
