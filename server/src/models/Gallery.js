const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Image title is required'],
        trim: true
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required']
    },
    thumbnailUrl: {
        type: String
    },
    publicId: {
        type: String
    },
    category: {
        type: String,
        enum: ['events', 'programs', 'team', 'impact', 'volunteers', 'other'],
        default: 'other'
    },
    program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program'
    },
    album: {
        type: String
    },
    eventDate: {
        type: Date
    },
    location: {
        type: String
    },
    tags: [{
        type: String,
        trim: true
    }],
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Gallery', gallerySchema);
