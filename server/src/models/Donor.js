const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Donor name is required'],
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
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: 'India' }
    },
    panNumber: {
        type: String,
        trim: true,
        uppercase: true
    },
    totalDonated: {
        type: Number,
        default: 0
    },
    donationCount: {
        type: Number,
        default: 0
    },
    isRecurringDonor: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String
    },
    tags: [{
        type: String
    }],
    source: {
        type: String,
        enum: ['website', 'campaign', 'referral', 'event', 'other'],
        default: 'website'
    }
}, {
    timestamps: true
});

// Index for search
donorSchema.index({ name: 'text', email: 'text' });

module.exports = mongoose.model('Donor', donorSchema);
