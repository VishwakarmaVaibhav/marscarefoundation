const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
        required: true
    },
    program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program'
    },
    amount: {
        type: Number,
        required: [true, 'Donation amount is required'],
        min: 1
    },
    currency: {
        type: String,
        default: 'INR'
    },
    type: {
        type: String,
        enum: ['one-time', 'monthly', 'quarterly', 'yearly'],
        default: 'one-time'
    },
    paymentMethod: {
        type: String,
        enum: ['razorpay', 'stripe', 'bank_transfer', 'cash', 'cheque'],
        default: 'razorpay'
    },
    transactionId: {
        type: String,
        unique: true,
        sparse: true
    },
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
    razorpaySignature: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    receipt: {
        number: String,
        generatedAt: Date,
        url: String
    },
    taxBenefit: {
        eligible: { type: Boolean, default: true },
        section: { type: String, default: '80G' },
        certificateUrl: String
    },
    campaign: {
        type: String
    },
    dedicatedTo: {
        name: String,
        message: String
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Index for filtering
donationSchema.index({ status: 1, createdAt: -1 });
donationSchema.index({ donor: 1, createdAt: -1 });

module.exports = mongoose.model('Donation', donationSchema);
