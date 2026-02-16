const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        required: [true, 'Subject is required']
    },
    message: {
        type: String,
        required: [true, 'Message is required']
    },
    type: {
        type: String,
        enum: ['general', 'partnership', 'media', 'donation-query', 'volunteer-query', 'complaint', 'other'],
        default: 'general'
    },
    status: {
        type: String,
        enum: ['new', 'in-progress', 'responded', 'closed'],
        default: 'new'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    response: {
        message: String,
        respondedAt: Date,
        respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    source: {
        type: String,
        default: 'website'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
