const express = require('express');
const router = express.Router();
const {
    getHeroes,
    getAdminHeroes,
    createHero,
    updateHero,
    deleteHero
} = require('../controllers/hero.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getHeroes);

// Protected routes (Admin only)
router.get('/admin', protect, authorize('admin'), getAdminHeroes);
router.post('/', protect, authorize('admin'), upload.fields([{ name: 'media', maxCount: 1 }, { name: 'mobileMedia', maxCount: 1 }]), createHero);
router.put('/:id', protect, authorize('admin'), upload.fields([{ name: 'media', maxCount: 1 }, { name: 'mobileMedia', maxCount: 1 }]), updateHero);
router.delete('/:id', protect, authorize('admin'), deleteHero);

module.exports = router;
