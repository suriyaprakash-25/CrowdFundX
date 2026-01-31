const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Campaign = require('./models/Campaign');
const Donation = require('./models/Donation');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        // Clear existing data
        await Donation.deleteMany();
        await Campaign.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed...');

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        const createdUsers = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword, // Manually hashed since performace pre-save hook might not trigger on insertMany depending on version, but best to be safe. Actually insertMany doesn't trigger pre-save hooks in Mongoose 5/6 purely. better to use create or just hash here.
                role: 'admin',
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: hashedPassword,
                role: 'user',
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: hashedPassword,
                role: 'user',
            },
        ]);

        const adminUser = createdUsers[0]._id;
        const user1 = createdUsers[1]._id;
        const user2 = createdUsers[2]._id;

        console.log('Users Created...');

        // Create Campaigns
        const campaigns = [
            {
                title: 'Help Build a Community Library',
                description: 'We are raising funds to build a library for underprivileged children in our community. Education is the key to a better future, and books are the tools we need. This library will provide free access to thousands of books, computers, and study spaces for over 500 children. Join us in making knowledge accessible to all.',
                goalAmount: 500000,
                raisedAmount: 125000,
                image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                category: 'Education',
                creator: user1,
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                status: 'active',
            },
            {
                title: 'Clean Water for Rural Villages',
                description: 'Millions of people lack access to clean drinking water. Our mission is to install water purification systems in 10 rural villages. This project will reduce waterborne diseases and improve the overall health of thousands of families. Your donation brings life-sustaining clean water to those who need it most.',
                goalAmount: 800000,
                raisedAmount: 450000,
                image: 'https://images.unsplash.com/photo-1538300342682-cf57afb97285?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                category: 'Community',
                creator: user2,
                deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                status: 'active',
            },
            {
                title: 'Emergency Medical Relief Fund',
                description: 'Support efficient emergency medical services for accident victims. Funds will go towards purchasing ambulances and medical supplies for our rapid response team. Every second counts in an emergency, and your contribution can help save lives on the road.',
                goalAmount: 1000000,
                raisedAmount: 890000,
                image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                category: 'Medical',
                creator: user1,
                deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                status: 'active',
            },
            {
                title: 'Reforestation Project 2026',
                description: 'Our planet needs more trees. We aim to plant 10,000 trees in deforested areas to combat climate change and restore local ecosystems. This initiative involves local communities in planting and maintaining the saplings. Help us make the world greener, one tree at a time.',
                goalAmount: 250000,
                raisedAmount: 60000,
                image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                category: 'Environment',
                creator: user2,
                deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                status: 'active',
            },
            {
                title: 'Tech Skills Bootcamp for Youth',
                description: 'Empowering the next generation with coding skills. We are organizing a free 12-week coding bootcamp for unemployed youth. The curriculum covers web development, design, and soft skills to prepare them for the job market. Your sponsorship covers laptops and internet access for students.',
                goalAmount: 300000,
                raisedAmount: 15000,
                image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                category: 'Technology',
                creator: adminUser,
                deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                status: 'active',
            },
            {
                title: 'Animal Shelter Expansion',
                description: 'Our local animal shelter is at capacity. We need to build new kennels and a medical wing to rescue more stray dogs and cats. These animals deserve a safe place to heal and wait for their forever homes. Join us in being a voice for the voiceless.',
                goalAmount: 400000,
                raisedAmount: 320000,
                image: 'https://images.unsplash.com/photo-1596272875729-ed2c21ebbbda?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                category: 'Community',
                creator: user1,
                deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                status: 'active',
            },
            {
                title: 'Support Local Arts Festival',
                description: 'Celebrating culture and creativity! We are organizing a weekend arts festival to showcase local painters, musicians, and performers. The event is free for the public, but we need funds for logistics, stage setup, and artist honorariums.',
                goalAmount: 150000,
                raisedAmount: 150000,
                image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                category: 'Other',
                creator: user2,
                deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Ended 2 days ago
                status: 'completed',
            },
        ];

        await Campaign.insertMany(campaigns);

        console.log('Campaigns Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
