const Donor = require('../models/Donor');
const Donation = require('../models/Donation');

// @desc    Get all donors
// @route   GET /api/donors
// @access  Private
exports.getDonors = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            minAmount,
            maxAmount,
            startDate,
            endDate
        } = req.query;

        const query = {};

        if (search) {
            query.$text = { $search: search };
        }

        if (minAmount || maxAmount) {
            query.totalDonated = {};
            if (minAmount) query.totalDonated.$gte = parseFloat(minAmount);
            if (maxAmount) query.totalDonated.$lte = parseFloat(maxAmount);
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const donors = await Donor.find(query)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Donor.countDocuments(query);

        res.json({
            success: true,
            data: donors,
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

// @desc    Get single donor with donation history
// @route   GET /api/donors/:id
// @access  Private
exports.getDonor = async (req, res, next) => {
    try {
        const donor = await Donor.findById(req.params.id);

        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor not found'
            });
        }

        // Get donation history
        const donations = await Donation.find({ donor: donor._id })
            .populate('program', 'title')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                ...donor.toObject(),
                donations
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create donor
// @route   POST /api/donors
// @access  Private
exports.createDonor = async (req, res, next) => {
    try {
        const donor = await Donor.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Donor created successfully',
            data: donor
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update donor
// @route   PUT /api/donors/:id
// @access  Private
exports.updateDonor = async (req, res, next) => {
    try {
        const donor = await Donor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor not found'
            });
        }

        res.json({
            success: true,
            message: 'Donor updated successfully',
            data: donor
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete donor
// @route   DELETE /api/donors/:id
// @access  Private (Admin)
exports.deleteDonor = async (req, res, next) => {
    try {
        const donor = await Donor.findById(req.params.id);

        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor not found'
            });
        }

        await donor.deleteOne();

        res.json({
            success: true,
            message: 'Donor deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Export donors to CSV
// @route   GET /api/donors/export
// @access  Private
exports.exportDonors = async (req, res, next) => {
    try {
        const { startDate, endDate, minAmount, maxAmount } = req.query;

        const query = {};

        if (minAmount || maxAmount) {
            query.totalDonated = {};
            if (minAmount) query.totalDonated.$gte = parseFloat(minAmount);
            if (maxAmount) query.totalDonated.$lte = parseFloat(maxAmount);
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const donors = await Donor.find(query).sort({ createdAt: -1 });

        // Convert to CSV format
        const csvHeader = 'Name,Email,Phone,PAN,Total Donated,Donation Count,Created At\n';
        const csvData = donors.map(d =>
            `"${d.name}","${d.email}","${d.phone || ''}","${d.panNumber || ''}",${d.totalDonated},${d.donationCount},"${d.createdAt.toISOString()}"`
        ).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=donors-export.csv');
        res.send(csvHeader + csvData);
    } catch (error) {
        next(error);
    }
};

// @desc    Get donor statistics
// @route   GET /api/donors/stats
// @access  Private
exports.getDonorStats = async (req, res, next) => {
    try {
        const totalDonors = await Donor.countDocuments();
        const recurringDonors = await Donor.countDocuments({ isRecurringDonor: true });

        const topDonors = await Donor.find()
            .sort({ totalDonated: -1 })
            .limit(10)
            .select('name email totalDonated donationCount');

        const totalDonationsAmount = await Donor.aggregate([
            { $group: { _id: null, total: { $sum: '$totalDonated' } } }
        ]);

        res.json({
            success: true,
            data: {
                totalDonors,
                recurringDonors,
                topDonors,
                totalDonationsAmount: totalDonationsAmount[0]?.total || 0
            }
        });
    } catch (error) {
        next(error);
    }
};
