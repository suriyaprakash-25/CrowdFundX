const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');

// @desc    Get Admin Stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCampaigns = await Campaign.countDocuments();
        const activeCampaigns = await Campaign.countDocuments({ status: 'active' });
        const completedCampaigns = await Campaign.countDocuments({ status: 'completed' }); // Fixed typo 'complete' -> 'completed'
        const totalDonations = await Donation.countDocuments();

        // Calculate total funds raised
        const totalRaisedGroup = await Donation.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const totalFunds = totalRaisedGroup.length > 0 ? totalRaisedGroup[0].total : 0;

        // Monthly Data for Chart (Last 6 months)
        const monthlyDonations = await Donation.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Convert to readable month names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const chartData = monthlyDonations.map(item => ({
            name: monthNames[item._id - 1],
            amount: item.totalAmount
        }));

        // Recent Transactions
        const recentTransactions = await Donation.find()
            .populate('donor', 'name email')
            .populate('campaign', 'title')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            totalUsers,
            totalCampaigns,
            activeCampaigns,
            completedCampaigns,
            totalDonations,
            totalFunds,
            chartData,
            recentTransactions,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Users with Pagination and Search
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword
            ? {
                $or: [
                    { name: { $regex: req.query.keyword, $options: 'i' } },
                    { email: { $regex: req.query.keyword, $options: 'i' } },
                ],
            }
            : {};

        const count = await User.countDocuments({ ...keyword });
        const users = await User.find({ ...keyword })
            .select('-password')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ users, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle Ban User
// @route   PUT /api/admin/users/:id/ban
// @access  Private (Admin)
const toggleBanUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.isBanned = !user.isBanned;
            await user.save();
            res.json({ message: `User ${user.isBanned ? 'banned' : 'unbanned'}`, isBanned: user.isBanned });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Delete User
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get All Campaigns (Admin)
// @route   GET /api/admin/campaigns
// @access  Private (Admin)
const getAdminCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({})
            .populate('creator', 'name email')
            .sort({ createdAt: -1 });
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Approve/Reject Campaign
// @route   PUT /api/admin/campaigns/:id/status
// @access  Private (Admin)
const updateCampaignStatus = async (req, res) => {
    try {
        const { isApproved, status, rejectionReason } = req.body;
        const campaign = await Campaign.findById(req.params.id);

        if (campaign) {
            if (isApproved !== undefined) campaign.isApproved = isApproved;
            if (status) campaign.status = status;
            if (rejectionReason) campaign.rejectionReason = rejectionReason;

            await campaign.save();
            res.json(campaign);
        } else {
            res.status(404).json({ message: 'Campaign not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Delete Campaign (Admin)
// @route   DELETE /api/admin/campaigns/:id
// @access  Private (Admin)
const deleteAdminCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (campaign) {
            await campaign.deleteOne();
            res.json({ message: 'Campaign removed' });
        } else {
            res.status(404).json({ message: 'Campaign not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get All Donations (Admin Monitoring)
// @route   GET /api/admin/donations
// @access  Private (Admin)
const getAdminDonations = async (req, res) => {
    try {
        const donations = await Donation.find({})
            .populate('donor', 'name email')
            .populate('campaign', 'title')
            .sort({ createdAt: -1 });

        // Flag suspicious
        const donationsWithFlags = donations.map(d => ({
            ...d.toObject(),
            isSuspicious: d.amount > 50000
        }));

        res.json(donationsWithFlags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    getAdminStats,
    getUsers,
    toggleBanUser,
    deleteUser,
    getAdminCampaigns,
    updateCampaignStatus,
    deleteAdminCampaign,
    getAdminDonations
};
