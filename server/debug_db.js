const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const testDb = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const email = `testuser_${Date.now()}@example.com`;
        console.log(`Attempting to create user: ${email}`);

        const user = await User.create({
            name: 'Test Debug User',
            email: email,
            password: 'password123'
        });

        console.log('User created successfully:', user._id);

        console.log('Attempting to find user...');
        const foundUser = await User.findById(user._id);
        console.log('User found:', foundUser.email);

        console.log('Cleaning up...');
        await User.findByIdAndDelete(user._id);
        console.log('Cleanup done.');

        process.exit(0);
    } catch (error) {
        console.error('DB Operation Failed:', error);
        process.exit(1);
    }
};

testDb();
