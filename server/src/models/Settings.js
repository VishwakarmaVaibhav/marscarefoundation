const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    category: {
        type: String,
        enum: ['general', 'seo', 'social', 'contact', 'donation', 'email'],
        default: 'general'
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

// Default settings
const defaultSettings = {
    // General
    siteName: 'Mars Care Foundation',
    siteTagline: 'Caring for Humanity',
    siteLogo: '',
    favicon: '',

    // SEO
    defaultMetaTitle: 'Mars Care Foundation - Caring for Humanity',
    defaultMetaDescription: 'Mars Care Foundation is dedicated to transforming lives through education, healthcare, and community development programs.',
    defaultMetaKeywords: ['NGO', 'charity', 'donation', 'education', 'healthcare', 'India'],
    googleAnalyticsId: '',

    // Social
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',

    // Contact
    contactEmail: 'info@marscarefoundation.org',
    contactPhone: '',
    contactAddress: '',
    googleMapsEmbed: '',

    // Donation
    minimumDonation: 100,
    suggestedAmounts: [500, 1000, 2500, 5000, 10000],
    razorpayEnabled: true,

    // Theme & Colors (Grounded Hope Palette)
    themeColors: {
        primary: '#1A3C5A',    // Deep Ocean Blue (Trust)
        secondary: '#F4A261',  // Muted Marigold (Hope & Action)
        accent: '#4A7C78',     // Sage Teal (Growth)
        background: '#F9F7F4', // Soft Off-White
        cardBg: '#EFECE6',     // Warm Grey
        text: '#2D3748'        // Deep Charcoal
    },

    // Email
    emailFooter: '',
    donationReceiptTemplate: ''
};

module.exports = { Settings: mongoose.model('Settings', settingsSchema), defaultSettings };
