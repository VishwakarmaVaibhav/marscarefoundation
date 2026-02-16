const ProgramCategory = require('../models/ProgramCategory');
const cloudinary = require('../config/cloudinary');
const { uploadFromBuffer } = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');

// @desc    Get all categories
// @route   GET /api/program-categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const categories = await ProgramCategory.find({ isActive: true }).sort({ order: 1 });
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get all categories (Admin)
// @route   GET /api/program-categories/admin
// @access  Private
exports.getAdminCategories = async (req, res) => {
    try {
        const categories = await ProgramCategory.find().sort({ order: 1 });
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Create new category
// @route   POST /api/program-categories
// @access  Private
exports.createCategory = async (req, res) => {
    try {
        const { title, description, order, isActive } = req.body;

        // Handle image upload if present
        let image = {};
        if (req.file) {
            const result = await uploadFromBuffer(req.file.buffer, {
                folder: 'ngo/categories'
            });
            image = {
                url: result.secure_url,
                publicId: result.public_id,
                alt: title
            };
        } else if (req.body.imageUrl) { // Allow direct URL if provided
            image = {
                url: req.body.imageUrl,
                alt: title
            };
        }

        const category = await ProgramCategory.create({
            title,
            description,
            image,
            order: order || 0,
            isActive: isActive === 'true' || isActive === true
        });

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};

// @desc    Update category
// @route   PUT /api/program-categories/:id
// @access  Private
exports.updateCategory = async (req, res) => {
    try {
        let category = await ProgramCategory.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }

        const { title, description, order, isActive } = req.body;

        // Handle image update
        if (req.file) {
            // Delete old image from cloudinary
            if (category.image && category.image.publicId) {
                await cloudinary.uploader.destroy(category.image.publicId);
            }
            const result = await uploadFromBuffer(req.file.buffer, {
                folder: 'ngo/categories'
            });
            category.image = {
                url: result.secure_url,
                publicId: result.public_id,
                alt: title || category.title
            };
        } else if (req.body.imageUrl) {
            category.image = {
                url: req.body.imageUrl,
                alt: title || category.title
            };
        }

        if (title) category.title = title;
        if (description) category.description = description;
        if (order !== undefined) category.order = order;
        if (isActive !== undefined) category.isActive = isActive === 'true' || isActive === true;

        await category.save();

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};

// @desc    Delete category
// @route   DELETE /api/program-categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
    try {
        const category = await ProgramCategory.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }

        // Delete from Cloudinary
        if (category.image && category.image.publicId) {
            await cloudinary.uploader.destroy(category.image.publicId);
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};
