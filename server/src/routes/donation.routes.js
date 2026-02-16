const express = require('express');
const router = express.Router();
const {
    createOrder,
    verifyPayment,
    getDonations,
    getDonation,
    getDonationStats,
    exportDonations
} = require('../controllers/donation.controller');
const { protect } = require('../middleware/auth');
const { donationValidation, validate } = require('../middleware/validate');

// Public routes (for donation processing)
router.post('/create-order', donationValidation, validate, createOrder);
router.post('/verify', verifyPayment);

// Protected routes
router.get('/export', protect, exportDonations);
router.get('/stats', protect, getDonationStats);
router.get('/', protect, getDonations);
router.get('/:id', protect, getDonation);

module.exports = router;
