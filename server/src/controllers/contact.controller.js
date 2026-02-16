const Contact = require('../models/Contact');

// @desc    Submit contact form (public)
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res, next) => {
    try {
        const contact = await Contact.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Thank you for contacting us. We will get back to you soon.',
            data: {
                id: contact._id,
                subject: contact.subject
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private
exports.getContacts = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            type
        } = req.query;

        const query = {};
        if (status) query.status = status;
        if (type) query.type = type;

        const contacts = await Contact.find(query)
            .populate('assignedTo', 'name')
            .populate('response.respondedBy', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Contact.countDocuments(query);

        res.json({
            success: true,
            data: contacts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single contact
// @route   GET /api/contact/:id
// @access  Private
exports.getContact = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('response.respondedBy', 'name');

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            data: contact
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update contact status/response
// @route   PUT /api/contact/:id
// @access  Private
exports.updateContact = async (req, res, next) => {
    try {
        const { status, assignedTo, responseMessage } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (assignedTo) updateData.assignedTo = assignedTo;

        if (responseMessage) {
            updateData.response = {
                message: responseMessage,
                respondedAt: new Date(),
                respondedBy: req.user._id
            };
            updateData.status = 'responded';
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact updated successfully',
            data: contact
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
exports.deleteContact = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        await contact.deleteOne();

        res.json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
