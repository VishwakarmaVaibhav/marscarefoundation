const Blog = require('../models/Blog');
const cloudinary = require('../config/cloudinary');
const { uploadFromBuffer } = require('../utils/cloudinary');

// @desc    Get all blogs (public)
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            tag,
            search,
            status = 'published',
            featured
        } = req.query;

        const query = {};

        // Only show published for public, all for admin
        if (!req.user) {
            query.status = 'published';
        } else if (status) {
            query.status = status;
        }

        if (category) query.category = category;
        if (tag) query.tags = tag;
        if (featured === 'true') query.isFeatured = true;

        if (search) {
            query.$text = { $search: search };
        }

        const blogs = await Blog.find(query)
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Blog.countDocuments(query);

        res.json({
            success: true,
            data: blogs,
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

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
exports.getBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug })
            .populate('author', 'name avatar');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Increment view count
        blog.viewCount += 1;
        await blog.save();

        res.json({
            success: true,
            data: blog
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private
exports.createBlog = async (req, res, next) => {
    try {
        req.body.author = req.user._id;

        // Handle image upload to cloudinary
        if (req.file) {
            const result = await uploadFromBuffer(req.file.buffer, {
                folder: 'ngo/blogs'
            });
            req.body.featuredImage = {
                url: result.secure_url,
                publicId: result.public_id
            };
        }

        // Set published date if status is published
        if (req.body.status === 'published') {
            req.body.publishedAt = new Date();
        }

        const blog = await Blog.create(req.body);
        await blog.populate('author', 'name avatar');

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: blog
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
exports.updateBlog = async (req, res, next) => {
    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Handle new image upload
        if (req.file) {
            // Delete old image from cloudinary
            if (blog.featuredImage?.publicId) {
                await cloudinary.uploader.destroy(blog.featuredImage.publicId);
            }

            const result = await uploadFromBuffer(req.file.buffer, {
                folder: 'ngo/blogs'
            });
            req.body.featuredImage = {
                url: result.secure_url,
                publicId: result.public_id
            };
        }

        // Set published date if status changed to published
        if (req.body.status === 'published' && blog.status !== 'published') {
            req.body.publishedAt = new Date();
        }

        blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('author', 'name avatar');

        res.json({
            success: true,
            message: 'Blog updated successfully',
            data: blog
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
exports.deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Delete image from cloudinary
        if (blog.featuredImage?.publicId) {
            await cloudinary.uploader.destroy(blog.featuredImage.publicId);
        }

        await blog.deleteOne();

        res.json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get blog categories
// @route   GET /api/blogs/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Blog.distinct('category');

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};
