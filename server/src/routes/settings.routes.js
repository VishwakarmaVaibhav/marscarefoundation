const express = require('express');
const router = express.Router();
const {
    getSettings,
    updateSettings,
    getSetting,
    initSettings
} = require('../controllers/settings.controller');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getSettings);
router.get('/:key', getSetting);

// Protected routes
router.put('/', protect, authorize('admin'), updateSettings);
router.post('/init', protect, authorize('admin'), initSettings);

module.exports = router;
