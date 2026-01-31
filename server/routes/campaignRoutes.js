const express = require('express');
const router = express.Router();
const {
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
} = require('../controllers/campaignController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getCampaigns).post(protect, createCampaign);
router
    .route('/:id')
    .get(getCampaign)
    .put(protect, updateCampaign)
    .delete(protect, deleteCampaign);

module.exports = router;
