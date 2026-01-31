const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    campaign: {
        type: mongoose.Schema.ObjectId,
        ref: 'Campaign',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentId: {
        type: String, // Razorpay Payment ID
        required: true,
    },
    orderId: {
        type: String, // Razorpay Order ID
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed', // Assuming we create record after success, or updated via webhook
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Donation', donationSchema);
