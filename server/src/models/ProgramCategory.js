const mongoose = require('mongoose');

const programCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Category title is required'],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        maxlength: 500
    },
    image: {
        url: String,
        alt: String,
        publicId: String
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Auto-generate slug from title
programCategorySchema.pre('validate', function (next) {
    if (this.title && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

module.exports = mongoose.model('ProgramCategory', programCategorySchema);
