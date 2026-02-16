const Volunteer = require('../models/Volunteer');
const Program = require('../models/Program');
const { sendVolunteerApproval, sendVolunteerAssignment } = require('../services/email.service');

// @desc    Get all volunteers
// @route   GET /api/volunteers
// @access  Private
exports.getVolunteers = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            skill,
            search,
            availability
        } = req.query;

        const query = {};

        if (status) query.status = status;
        if (skill) query.skills = skill;
        if (availability) query.availability = availability;

        if (search) {
            query.$text = { $search: search };
        }

        const volunteers = await Volunteer.find(query)
            .populate('preferredPrograms', 'title')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Volunteer.countDocuments(query);

        res.json({
            success: true,
            data: volunteers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('getVolunteers Error:', error);
        next(error);
    }
};

// @desc    Get single volunteer
// @route   GET /api/volunteers/:id
// @access  Private
exports.getVolunteer = async (req, res, next) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id)
            .populate('preferredPrograms');

        if (!volunteer) {
            return res.status(404).json({
                success: false,
                message: 'Volunteer not found'
            });
        }

        res.json({
            success: true,
            data: volunteer
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Register as volunteer (public)
// @route   POST /api/volunteers/register
// @access  Public
exports.registerVolunteer = async (req, res, next) => {
    try {
        // Check if email already exists
        const existing = await Volunteer.findOne({ email: req.body.email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'You have already registered as a volunteer'
            });
        }

        const volunteer = await Volunteer.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Thank you for registering! We will contact you soon.',
            data: {
                id: volunteer._id,
                name: volunteer.name,
                email: volunteer.email
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update volunteer
// @route   PUT /api/volunteers/:id
// @access  Private
exports.updateVolunteer = async (req, res, next) => {
    try {
        // Set joined date when approved
        if (req.body.status === 'approved' || req.body.status === 'active') {
            req.body.joinedDate = req.body.joinedDate || new Date();
        }

        const volunteer = await Volunteer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!volunteer) {
            return res.status(404).json({
                success: false,
                message: 'Volunteer not found'
            });
        }

        res.json({
            success: true,
            message: 'Volunteer updated successfully',
            data: volunteer
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete volunteer
// @route   DELETE /api/volunteers/:id
// @access  Private (Admin)
exports.deleteVolunteer = async (req, res, next) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);

        if (!volunteer) {
            return res.status(404).json({
                success: false,
                message: 'Volunteer not found'
            });
        }

        await volunteer.deleteOne();

        res.json({
            success: true,
            message: 'Volunteer deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get volunteer statistics
// @route   GET /api/volunteers/stats
// @access  Private
exports.getVolunteerStats = async (req, res, next) => {
    try {
        const totalVolunteers = await Volunteer.countDocuments();
        const activeVolunteers = await Volunteer.countDocuments({ status: 'active' });
        const pendingApprovals = await Volunteer.countDocuments({ status: 'pending' });

        const bySkill = await Volunteer.aggregate([
            { $unwind: '$skills' },
            { $group: { _id: '$skills', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const totalHours = await Volunteer.aggregate([
            { $group: { _id: null, total: { $sum: '$totalHours' } } }
        ]);

        res.json({
            success: true,
            data: {
                totalVolunteers,
                activeVolunteers,
                pendingApprovals,
                bySkill,
                totalHours: totalHours[0]?.total || 0
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Log volunteer hours
// @route   PUT /api/volunteers/:id/hours
// @access  Private
exports.logHours = async (req, res, next) => {
    try {
        const { hours } = req.body;

        const volunteer = await Volunteer.findByIdAndUpdate(
            req.params.id,
            { $inc: { totalHours: hours } },
            { new: true }
        );

        if (!volunteer) {
            return res.status(404).json({
                success: false,
                message: 'Volunteer not found'
            });
        }

        res.json({
            success: true,
            message: `${hours} hours logged successfully`,
            data: volunteer
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve volunteer
// @route   PUT /api/volunteers/:id/approve
// @access  Private (Admin)
exports.approveVolunteer = async (req, res, next) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);

        if (!volunteer) {
            return res.status(404).json({
                success: false,
                message: 'Volunteer not found'
            });
        }

        volunteer.status = 'approved';
        volunteer.joinedDate = new Date();
        await volunteer.save();

        // Send approval email
        await sendVolunteerApproval(volunteer);

        res.json({
            success: true,
            message: 'Volunteer approved successfully',
            data: volunteer
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Assign task to volunteer
// @route   POST /api/volunteers/:id/assign
// @access  Private (Admin)
exports.assignVolunteer = async (req, res, next) => {
    try {
        const { programId, task, description, dueDate, notes, notifyEmail } = req.body;

        const volunteer = await Volunteer.findById(req.params.id);

        if (!volunteer) {
            return res.status(404).json({
                success: false,
                message: 'Volunteer not found'
            });
        }

        const assignment = {
            program: programId,
            task,
            description,
            dueDate,
            notes,
            status: 'assigned',
            assignedDate: new Date()
        };

        volunteer.assignments.push(assignment);
        await volunteer.save();

        // Send email if requested
        if (notifyEmail) {
            let programTitle = '';
            if (programId) {
                const program = await Program.findById(programId);
                if (program) programTitle = program.title;
            }
            await sendVolunteerAssignment(volunteer, assignment, programTitle);
        }

        res.json({
            success: true,
            message: 'Task assigned successfully',
            data: volunteer
        });
    } catch (error) {
        next(error);
    }
};
