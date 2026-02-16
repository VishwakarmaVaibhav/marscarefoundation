const express = require('express');
const router = express.Router();
const {
    getPrograms,
    getProgram,
    createProgram,
    updateProgram,
    deleteProgram,
    getCategories,
    getFeaturedPrograms
} = require('../controllers/program.controller');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/categories', getCategories);
router.get('/featured', getFeaturedPrograms);
router.get('/', optionalAuth, getPrograms);
router.get('/:slug', getProgram);

// Protected routes
router.post('/', protect, upload.fields([
    { name: 'featuredImage', maxCount: 1 },
    { name: 'mobileImage', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
]), createProgram);
router.put('/:id', protect, upload.fields([
    { name: 'featuredImage', maxCount: 1 },
    { name: 'mobileImage', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
]), updateProgram);
router.delete('/:id', protect, authorize('admin'), deleteProgram);

module.exports = router;
