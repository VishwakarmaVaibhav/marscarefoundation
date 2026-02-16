const Program = require('../models/Program');
const cloudinary = require('../config/cloudinary');

// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
exports.getPrograms = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            status = 'active',
            featured
        } = req.query;

        const query = {};

        // Filter by status for public
        if (!req.user) {
            query.status = 'active';
        } else if (status) {
            query.status = status;
        }

        if (category) query.category = category;
        if (featured === 'true') query.isFeatured = true;

        const programs = await Program.find(query)
            .sort({ order: 1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Program.countDocuments(query);

        res.json({
            success: true,
            data: programs,
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

// @desc    Get single program by slug
// @route   GET /api/programs/:slug
// @access  Public
exports.getProgram = async (req, res, next) => {
    try {
        const program = await Program.findOne({ slug: req.params.slug });

        if (!program) {
            return res.status(404).json({
                success: false,
                message: 'Program not found'
            });
        }

        res.json({
            success: true,
            data: program
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create program
// @route   POST /api/programs
// @access  Private
exports.createProgram = async (req, res, next) => {
    try {
        // Parse JSON fields from invalid string format
        if (req.body.features && typeof req.body.features === 'string') {
            try { req.body.features = JSON.parse(req.body.features); } catch (e) { req.body.features = []; }
        }
        if (req.body.testimonials && typeof req.body.testimonials === 'string') {
            try { req.body.testimonials = JSON.parse(req.body.testimonials); } catch (e) { req.body.testimonials = []; }
        }

        // Handle featured image upload
        req.body.featuredImage = {};
        if (req.files && req.files.featuredImage) {
            const result = await cloudinary.uploader.upload(req.files.featuredImage[0].path, {
                folder: 'ngo/programs'
            });
            req.body.featuredImage.url = result.secure_url;
            req.body.featuredImage.publicId = result.public_id;
        }

        // Handle mobile image upload
        if (req.files && req.files.mobileImage) {
            const result = await cloudinary.uploader.upload(req.files.mobileImage[0].path, {
                folder: 'ngo/programs/mobile'
            });
            req.body.featuredImage.mobileUrl = result.secure_url;
            req.body.featuredImage.mobilePublicId = result.public_id;
        }

        // Handle Gallery Uploads
        if (req.files && req.files.gallery) {
            const galleryImages = [];
            for (const file of req.files.gallery) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'ngo/programs/gallery'
                });
                galleryImages.push({
                    url: result.secure_url,
                    publicId: result.public_id,
                    alt: req.body.title || 'Program Image'
                });
            }
            req.body.gallery = galleryImages;
        }

        const program = await Program.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Program created successfully',
            data: program
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update program
// @route   PUT /api/programs/:id
// @access  Private
exports.updateProgram = async (req, res, next) => {
    try {
        let program = await Program.findById(req.params.id);

        if (!program) {
            return res.status(404).json({
                success: false,
                message: 'Program not found'
            });
        }

        // Parse JSON fields
        if (req.body.features && typeof req.body.features === 'string') {
            try { req.body.features = JSON.parse(req.body.features); } catch (e) { }
        }
        if (req.body.testimonials && typeof req.body.testimonials === 'string') {
            try { req.body.testimonials = JSON.parse(req.body.testimonials); } catch (e) { }
        }

        // Handle new image upload
        const featuredImage = { ...program.featuredImage };

        // Desktop Image
        if (req.files && req.files.featuredImage) {
            if (program.featuredImage?.publicId) {
                await cloudinary.uploader.destroy(program.featuredImage.publicId);
            }
            const result = await cloudinary.uploader.upload(req.files.featuredImage[0].path, {
                folder: 'ngo/programs'
            });
            featuredImage.url = result.secure_url;
            featuredImage.publicId = result.public_id;
        }

        // Mobile Image
        if (req.files && req.files.mobileImage) {
            if (program.featuredImage?.mobilePublicId) {
                await cloudinary.uploader.destroy(program.featuredImage.mobilePublicId);
            }
            const result = await cloudinary.uploader.upload(req.files.mobileImage[0].path, {
                folder: 'ngo/programs/mobile'
            });
            featuredImage.mobileUrl = result.secure_url;
            featuredImage.mobilePublicId = result.public_id;
        }

        req.body.featuredImage = featuredImage;

        // Handle Gallery Additions
        if (req.files && req.files.gallery) {
            const newGalleryImages = [];
            for (const file of req.files.gallery) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'ngo/programs/gallery'
                });
                newGalleryImages.push({
                    url: result.secure_url,
                    publicId: result.public_id,
                    alt: req.body.title || 'Program Image'
                });
            }
            req.body.gallery = [...(program.gallery || []), ...newGalleryImages];
        }

        program = await Program.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            message: 'Program updated successfully',
            data: program
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete program
// @route   DELETE /api/programs/:id
// @access  Private (Admin)
exports.deleteProgram = async (req, res, next) => {
    try {
        const program = await Program.findById(req.params.id);

        if (!program) {
            return res.status(404).json({
                success: false,
                message: 'Program not found'
            });
        }

        if (program.featuredImage?.publicId) {
            await cloudinary.uploader.destroy(program.featuredImage.publicId);
        }
        if (program.featuredImage?.mobilePublicId) {
            await cloudinary.uploader.destroy(program.featuredImage.mobilePublicId);
        }

        await program.deleteOne();

        res.json({
            success: true,
            message: 'Program deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get program categories
// @route   GET /api/programs/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
    try {
        const categories = [
            { value: 'education', label: 'Education' },
            { value: 'health', label: 'Healthcare' },
            { value: 'environment', label: 'Environment' },
            { value: 'women-empowerment', label: 'Women Empowerment' },
            { value: 'child-welfare', label: 'Child Welfare' },
            { value: 'elderly-care', label: 'Elderly Care' },
            { value: 'disaster-relief', label: 'Disaster Relief' },
            { value: 'rural-development', label: 'Rural Development' },
            { value: 'other', label: 'Other' }
        ];

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured programs for homepage
// @route   GET /api/programs/featured
// @access  Public
exports.getFeaturedPrograms = async (req, res, next) => {
    try {
        const programs = await Program.find({
            isFeatured: true,
            status: 'active'
        })
            .sort({ order: 1 })
            .limit(6);

        res.json({
            success: true,
            data: programs
        });
    } catch (error) {
        next(error);
    }
};
