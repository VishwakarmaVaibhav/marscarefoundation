const express = require('express');
const router = express.Router();
const {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    getCategories
} = require('../controllers/blog.controller');
const { protect, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { blogValidation, validate, idValidation } = require('../middleware/validate');

// Public routes
router.get('/categories', getCategories);
router.get('/', optionalAuth, getBlogs);
router.get('/:slug', getBlog);

// Protected routes
router.post('/', protect, upload.single('featuredImage'), blogValidation, validate, createBlog);
router.put('/:id', protect, upload.single('featuredImage'), updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
