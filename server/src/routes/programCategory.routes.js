const express = require('express');
const router = express.Router();
const {
    getCategories,
    getAdminCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/programCategory.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getCategories);

// Protected Admin routes
router.get('/admin', protect, authorize('admin'), getAdminCategories);
router.post('/', protect, authorize('admin'), upload.single('image'), createCategory);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;
