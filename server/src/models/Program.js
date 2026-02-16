const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Program title is required'],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    shortDescription: {
        type: String,
        maxlength: 200
    },
    description: {
        type: String,
        required: [true, 'Program description is required']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProgramCategory',
        required: true
    },
    featuredImage: {
        url: String, // Main/Desktop URL
        mobileUrl: String,
        alt: String,
        publicId: String,
        mobilePublicId: String
    },
    gallery: [{
        url: String,
        alt: String
    }],
    features: [{
        title: String,
        description: String,
        icon: String // e.g. 'book', 'heart', 'users' (lucide icon names)
    }],
    testimonials: [{
        name: String,
        role: String,
        message: String,
        image: String
    }],
    targetAmount: {
        type: Number,
        default: 0
    },
    raisedAmount: {
        type: Number,
        default: 0
    },
    donorCount: {
        type: Number,
        default: 0
    },
    beneficiaries: {
        count: Number,
        description: String
    },
    location: {
        city: String,
        state: String,
        country: { type: String, default: 'India' }
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['upcoming', 'active', 'completed', 'paused'],
        default: 'active'
    },
    impactMetrics: [{
        label: String,
        value: String,
        icon: String
    }],
    seo: {
        metaTitle: String,
        metaDescription: String,
        metaKeywords: [String],
        ogImage: String
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isAcceptingDonations: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Auto-generate slug from title
programSchema.pre('validate', function (next) {
    if (this.title && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

module.exports = mongoose.model('Program', programSchema);
