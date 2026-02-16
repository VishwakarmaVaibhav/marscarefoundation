const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    excerpt: {
        type: String,
        maxlength: 300
    },
    content: {
        type: String,
        required: [true, 'Blog content is required']
    },
    featuredImage: {
        url: String,
        alt: String,
        publicId: String
    },
    category: {
        type: String,
        enum: ['news', 'events', 'success-stories', 'announcements', 'impact-reports', 'Education', 'Healthcare', 'Empowerment', 'Impact'],
        default: 'news'
    },
    tags: [{
        type: String,
        trim: true
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seo: {
        metaTitle: String,
        metaDescription: String,
        metaKeywords: [String],
        ogImage: String,
        canonicalUrl: String
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    publishedAt: {
        type: Date
    },
    viewCount: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Auto-generate slug from title
blogSchema.pre('validate', function (next) {
    if (this.title && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// Index for search
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Blog', blogSchema);
