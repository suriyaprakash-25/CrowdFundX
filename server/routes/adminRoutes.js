const express = require('express');
const router = express.Router();
const {
    getAdminStats,
    getUsers,
    toggleBanUser,
    deleteUser,
    getAdminCampaigns,
    updateCampaignStatus,
    deleteAdminCampaign,
    getAdminDonations,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Protect all routes with auth + admin middleware
router.use(protect);
router.use(admin);

router.get('/stats', getAdminStats);

// User Management
router.get('/users', getUsers);
router.put('/users/:id/ban', toggleBanUser);
router.delete('/users/:id', deleteUser);

// Campaign Management
router.get('/campaigns', getAdminCampaigns);
router.put('/campaigns/:id/status', updateCampaignStatus);
router.delete('/campaigns/:id', deleteAdminCampaign);

// Donation Rules
router.get('/donations', getAdminDonations);

module.exports = router;
