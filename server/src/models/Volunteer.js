const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Volunteer name is required'],
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
        required: [true, 'Phone number is required'],
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    address: {
        city: String,
        state: String,
        pincode: String
    },
    occupation: {
        type: String
    },
    organization: {
        type: String
    },
    skills: [{
        type: String,
        enum: [
            'teaching',
            'medical',
            'counseling',
            'event-management',
            'photography',
            'social-media',
            'fundraising',
            'logistics',
            'administration',
            'legal',
            'technology',
            'content-writing',
            'translation',
            'driving',
            'other'
        ]
    }],
    languages: [{
        type: String
    }],
    availability: {
        type: String,
        enum: ['weekdays', 'weekends', 'both', 'flexible'],
        default: 'flexible'
    },
    hoursPerWeek: {
        type: Number,
        min: 1,
        max: 40
    },
    preferredPrograms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program'
    }],
    experience: {
        type: String
    },
    motivation: {
        type: String
    },
    emergencyContact: {
        name: String,
        phone: String,
        relation: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'active', 'inactive', 'rejected'],
        default: 'pending'
    },
    joinedDate: {
        type: Date
    },
    totalHours: {
        type: Number,
        default: 0
    },
    assignments: [{
        program: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Program'
        },
        task: String,
        description: String,
        status: {
            type: String,
            enum: ['assigned', 'in-progress', 'completed', 'cancelled'],
            default: 'assigned'
        },
        assignedDate: {
            type: Date,
            default: Date.now
        },
        dueDate: Date,
        completedDate: Date,
        notes: String
    }],
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Index for search
volunteerSchema.index({ name: 'text', email: 'text' });
volunteerSchema.index({ skills: 1 });

module.exports = mongoose.model('Volunteer', volunteerSchema);
