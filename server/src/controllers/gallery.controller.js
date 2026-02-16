const Gallery = require('../models/Gallery');
const Program = require('../models/Program');
const cloudinary = require('../config/cloudinary');
const { uploadFromBuffer } = require('../utils/cloudinary');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
exports.getGalleryItems = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            album,
            featured,
            program
        } = req.query;

        const query = { isPublished: true };

        if (category) query.category = category;
        if (album) query.album = album;
        if (featured === 'true') query.isFeatured = true;
        if (program) query.program = program;

        const items = await Gallery.find(query)
            .populate('program', 'title slug')
            .sort({ order: 1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Gallery.countDocuments(query);

        res.json({
            success: true,
            data: items,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
// @access  Public
exports.getGalleryItem = async (req, res, next) => {
    try {
        const item = await Gallery.findById(req.params.id).populate('program', 'title slug');

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item not found'
            });
        }

        res.json({
            success: true,
            data: item
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload gallery images
// @route   POST /api/gallery
// @access  Private
exports.uploadImages = async (req, res, next) => {
    try {
        const { category, album, eventDate, location, tags, program } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please upload at least one image'
            });
        }

        const uploadedItems = [];

        for (const file of req.files) {
            // Upload to Cloudinary
            const result = await uploadFromBuffer(file.buffer, {
                folder: 'ngo/gallery',
                transformation: [
                    { width: 1200, height: 800, crop: 'limit' },
                    { quality: 'auto' }
                ]
            });

            // Create thumbnail
            const thumbnail = cloudinary.url(result.public_id, {
                width: 300,
                height: 200,
                crop: 'fill'
            });

            const item = await Gallery.create({
                title: file.originalname.split('.')[0],
                imageUrl: result.secure_url,
                thumbnailUrl: thumbnail,
                publicId: result.public_id,
                category: category || 'other',
                album,
                program,
                eventDate,
                location,
                tags: tags ? tags.split(',').map(t => t.trim()) : [],
                uploadedBy: req.user._id
            });

            uploadedItems.push(item);
        }

        res.status(201).json({
            success: true,
            message: `${uploadedItems.length} images uploaded successfully`,
            data: uploadedItems
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private
exports.updateGalleryItem = async (req, res, next) => {
    try {
        const item = await Gallery.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item not found'
            });
        }

        res.json({
            success: true,
            message: 'Gallery item updated successfully',
            data: item
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private
exports.deleteGalleryItem = async (req, res, next) => {
    try {
        const item = await Gallery.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item not found'
            });
        }

        // Delete from Cloudinary
        if (item.publicId) {
            await cloudinary.uploader.destroy(item.publicId);
        }

        await item.deleteOne();

        res.json({
            success: true,
            message: 'Gallery item deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get gallery albums
// @route   GET /api/gallery/albums
// @access  Public
exports.getAlbums = async (req, res, next) => {
    try {
        const albums = await Gallery.aggregate([
            { $match: { album: { $exists: true, $ne: '' } } },
            {
                $group: {
                    _id: '$album',
                    count: { $sum: 1 },
                    thumbnail: { $first: '$thumbnailUrl' }
                }
            }
        ]);

        res.json({
            success: true,
            data: albums
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reorder gallery items
// @route   PUT /api/gallery/reorder
// @access  Private
exports.reorderItems = async (req, res, next) => {
    try {
        const { items } = req.body; // Array of { id, order }

        for (const item of items) {
            await Gallery.findByIdAndUpdate(item.id, { order: item.order });
        }

        res.json({
            success: true,
            message: 'Gallery reordered successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Import images from Program to Gallery
// @route   POST /api/gallery/import-program
// @access  Private
exports.importProgramImages = async (req, res, next) => {
    try {
        const { programId, images } = req.body; // images: [{url, alt, publicId}]

        const program = await Program.findById(programId);
        if (!program) {
            return res.status(404).json({ success: false, message: 'Program not found' });
        }

        const createdItems = [];

        for (const img of images) {
            // Check if already exists to avoid duplicates (optional, based on URL)
            const exists = await Gallery.findOne({ imageUrl: img.url });
            if (exists) continue;

            const newItem = await Gallery.create({
                title: img.alt || program.title,
                imageUrl: img.url,
                thumbnailUrl: img.url, // Cloudinary usually handles resizing on the fly
                publicId: img.publicId,
                category: 'programs',
                program: programId,
                description: `Imported from program: ${program.title}`,
                uploadedBy: req.user._id
            });
            createdItems.push(newItem);
        }

        res.status(201).json({
            success: true,
            message: `Imported ${createdItems.length} images from program`,
            data: createdItems
        });
    } catch (error) {
        next(error);
    }
};
