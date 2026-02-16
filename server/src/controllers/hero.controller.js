const Hero = require('../models/Hero');
const cloudinary = require('../config/cloudinary');
const { uploadFromBuffer } = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');

// @desc    Get all heroes
// @route   GET /api/heroes
// @access  Public
exports.getHeroes = async (req, res) => {
    try {
        const heroes = await Hero.find({ isActive: true }).sort({ order: 1 });
        res.status(200).json({
            success: true,
            count: heroes.length,
            data: heroes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get all heroes (Admin)
// @route   GET /api/heroes/admin
// @access  Private
exports.getAdminHeroes = async (req, res) => {
    try {
        const heroes = await Hero.find().sort({ order: 1 });
        res.status(200).json({
            success: true,
            count: heroes.length,
            data: heroes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Create new hero
// @route   POST /api/heroes
// @access  Private
exports.createHero = async (req, res) => {
    try {
        let mediaUrl = '';
        let mobileMediaUrl = '';

        // Handle Desktop Media
        if (req.files && req.files.media) {
            const result = await uploadFromBuffer(req.files.media[0].buffer, {
                folder: 'ngo/hero',
                resource_type: 'auto'
            });
            mediaUrl = result.secure_url;
            req.body.mediaPublicId = result.public_id;
        } else if (req.body.mediaUrl) {
            mediaUrl = req.body.mediaUrl;
        }

        // Handle Mobile Media
        if (req.files && req.files.mobileMedia) {
            const result = await uploadFromBuffer(req.files.mobileMedia[0].buffer, {
                folder: 'ngo/hero/mobile',
                resource_type: 'auto'
            });
            mobileMediaUrl = result.secure_url;
            req.body.mobileMediaPublicId = result.public_id;
        } else if (req.body.mobileMediaUrl) {
            mobileMediaUrl = req.body.mobileMediaUrl;
        }

        if (!mediaUrl) {
            return res.status(400).json({
                success: false,
                error: 'Please upload a desktop image/video or provide a media URL'
            });
        }

        const { title, subtitle, type, order, isActive, link, buttons, clickAction } = req.body;

        // Parse buttons
        let parsedButtons = [];
        if (typeof buttons === 'string') {
            try {
                parsedButtons = JSON.parse(buttons);
            } catch (e) {
                parsedButtons = [];
            }
        } else if (Array.isArray(buttons)) {
            parsedButtons = buttons;
        }

        const hero = await Hero.create({
            title,
            subtitle,
            type: type || 'image',
            mediaUrl,
            mediaPublicId: req.body.mediaPublicId,
            mobileMediaUrl,
            mobileMediaPublicId: req.body.mobileMediaPublicId,
            link,
            buttons: parsedButtons,
            clickAction: clickAction || 'button',
            order: order || 0,
            isActive: isActive === 'true'
        });

        res.status(201).json({
            success: true,
            data: hero
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};

// @desc    Update hero
// @route   PUT /api/heroes/:id
// @access  Private
exports.updateHero = async (req, res) => {
    try {
        let hero = await Hero.findById(req.params.id);

        if (!hero) {
            return res.status(404).json({
                success: false,
                error: 'Hero not found'
            });
        }

        const { title, subtitle, type, order, isActive, link, buttons, clickAction } = req.body;
        let mediaUrl = hero.mediaUrl;
        let mobileMediaUrl = hero.mobileMediaUrl;

        // Handle Desktop Media Update
        if (req.files && req.files.media) {
            if (hero.mediaPublicId) {
                await cloudinary.uploader.destroy(hero.mediaPublicId);
            }
            const result = await uploadFromBuffer(req.files.media[0].buffer, {
                folder: 'ngo/hero',
                resource_type: 'auto'
            });
            mediaUrl = result.secure_url;
            req.body.mediaPublicId = result.public_id;
        } else if (req.body.mediaUrl) {
            mediaUrl = req.body.mediaUrl;
        }

        // Handle Mobile Media Update
        if (req.files && req.files.mobileMedia) {
            if (hero.mobileMediaPublicId) {
                await cloudinary.uploader.destroy(hero.mobileMediaPublicId);
            }
            const result = await uploadFromBuffer(req.files.mobileMedia[0].buffer, {
                folder: 'ngo/hero/mobile',
                resource_type: 'auto'
            });
            mobileMediaUrl = result.secure_url;
            req.body.mobileMediaPublicId = result.public_id;
        } else if (req.body.mobileMediaUrl) {
            mobileMediaUrl = req.body.mobileMediaUrl;
        }

        // Parse buttons
        let parsedButtons = undefined;
        if (typeof buttons === 'string') {
            try {
                parsedButtons = JSON.parse(buttons);
            } catch (e) { }
        } else if (Array.isArray(buttons)) {
            parsedButtons = buttons;
        }

        hero = await Hero.findByIdAndUpdate(req.params.id, {
            title,
            subtitle,
            type,
            mediaUrl,
            mediaPublicId: req.body.mediaPublicId || hero.mediaPublicId,
            mobileMediaUrl,
            mobileMediaPublicId: req.body.mobileMediaPublicId || hero.mobileMediaPublicId,
            link,
            buttons: parsedButtons !== undefined ? parsedButtons : hero.buttons,
            clickAction: clickAction || hero.clickAction,
            order,
            isActive: isActive === 'true' || isActive === true
        }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: hero
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};

// @desc    Delete hero
// @route   DELETE /api/heroes/:id
// @access  Private
exports.deleteHero = async (req, res) => {
    try {
        const hero = await Hero.findById(req.params.id);

        if (!hero) {
            return res.status(404).json({
                success: false,
                error: 'Hero not found'
            });
        }

        // Delete from Cloudinary
        if (hero.mediaPublicId) {
            await cloudinary.uploader.destroy(hero.mediaPublicId);
        }
        if (hero.mobileMediaPublicId) {
            await cloudinary.uploader.destroy(hero.mobileMediaPublicId);
        }

        await hero.deleteOne();

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
