const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Campaign = require('./models/Campaign');
const Donation = require('./models/Donation');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const seedDonations = async () => {
    try {
        // Check if we have users and campaigns
        const users = await User.find({ role: 'user' });
        const campaigns = await Campaign.find();

        if (users.length === 0 || campaigns.length === 0) {
            console.log('Please seed users and campaigns first.');
            process.exit();
        }

        const donations = [
            {
                amount: 5000,
                donor: users[0]._id,
                campaign: campaigns[0]._id,
                paymentId: 'pay_test_1234567890',
                orderId: 'order_test_1',
                status: 'completed',
                createdAt: new Date()
            },
            {
                amount: 15000,
                donor: users[1]._id,
                campaign: campaigns[0]._id,
                paymentId: 'pay_test_0987654321',
                orderId: 'order_test_2',
                status: 'completed',
                createdAt: new Date(new Date().setDate(new Date().getDate() - 2))
            },
            {
                amount: 60000,
                donor: users[0]._id,
                campaign: campaigns[2]._id,
                paymentId: 'pay_test_sus_1',
                orderId: 'order_test_3',
                status: 'completed',
                createdAt: new Date(new Date().setDate(new Date().getDate() - 5))
            },
            {
                amount: 2500,
                donor: users[1]._id,
                campaign: campaigns[1]._id,
                paymentId: 'pay_test_small_1',
                orderId: 'order_test_4',
                status: 'completed',
                createdAt: new Date(new Date().setDate(new Date().getDate() - 10))
            },
            {
                amount: 80000,
                donor: users[1]._id,
                campaign: campaigns[5]._id,
                paymentId: 'pay_test_sus_2',
                orderId: 'order_test_5',
                status: 'completed',
                createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
            }
        ];

        // Update raisedAmount for campaigns
        for (const d of donations) {
            await Donation.create(d);
            const campaign = await Campaign.findById(d.campaign);
            campaign.raisedAmount += d.amount;
            await campaign.save();
        }

        console.log('Donations Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedDonations();
