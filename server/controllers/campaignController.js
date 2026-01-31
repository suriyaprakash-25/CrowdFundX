const Campaign = require('../models/Campaign');

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Public
const getCampaigns = async (req, res) => {
    try {
        const { category, sort, search } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        let campaigns = Campaign.find(query).populate('creator', 'name email');

        // Sorting
        if (sort === 'raised') {
            campaigns = campaigns.sort({ raisedAmount: -1 });
        } else if (sort === 'deadline') {
            campaigns = campaigns.sort({ deadline: 1 });
        } else {
            campaigns = campaigns.sort({ createdAt: -1 }); // Recently added
        }

        const result = await campaigns;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Public
const getCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id).populate('creator', 'name email');

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a campaign
// @route   POST /api/campaigns
// @access  Private
const createCampaign = async (req, res) => {
    try {
        if (!req.body.title || !req.body.goalAmount || !req.body.deadline) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const campaign = await Campaign.create({
            ...req.body,
            creator: req.user.id,
        });

        res.status(201).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private (Owner only)
const updateCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the campaign creator
        if (campaign.creator.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedCampaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedCampaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private (Owner only)
const deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (campaign.creator.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await campaign.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
};
