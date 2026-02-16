const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false, // Made optional
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    subtitle: {
        type: String,
        required: false, // Made optional
        trim: true,
        maxlength: [500, 'Subtitle cannot be more than 500 characters']
    },
    type: {
        type: String,
        enum: ['image', 'video'],
        default: 'image'
    },
    mediaUrl: {
        type: String,
        required: [true, 'Please add an image or video']
    },
    mobileMediaUrl: {
        type: String,
        required: false
    },
    mediaPublicId: String,
    mobileMediaPublicId: String,
    // New Fields
    buttons: [{
        label: String,
        link: String,
        variant: {
            type: String,
            enum: ['primary', 'secondary', 'outline'],
            default: 'primary'
        }
    }],
    clickAction: {
        type: String,
        enum: ['button', 'card'], // 'button' = only buttons are clickable, 'card' = whole slide is clickable
        default: 'button'
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    link: { // Kept for backward compatibility or as the main link if clickAction='card'
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Hero', heroSchema);
