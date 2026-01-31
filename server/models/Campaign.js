const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a campaign title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    goalAmount: {
        type: Number,
        required: [true, 'Please add a goal amount'],
    },
    raisedAmount: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/600x400', // Default placeholder
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Medical', 'Education', 'Environment', 'Technology', 'Community', 'Other'],
    },
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    rejectionReason: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'expired'],
        default: 'active',
    },
    deadline: {
        type: Date,
        required: [true, 'Please add a deadline'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Campaign', campaignSchema);
