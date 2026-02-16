const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const Program = require('../models/Program');
const { sendDonationReceipt } = require('../services/email.service');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create donation order
// @route   POST /api/donations/create-order
// @access  Public
exports.createOrder = async (req, res, next) => {
    try {
        const {
            amount,
            donorName,
            donorEmail,
            donorPhone,
            donorAddress,
            panNumber,
            programId,
            type = 'one-time',
            isAnonymous = false,
            dedicatedTo,
            campaign
        } = req.body;

        // Create or find donor
        let donor = await Donor.findOne({ email: donorEmail });

        if (!donor) {
            donor = await Donor.create({
                name: donorName,
                email: donorEmail,
                phone: donorPhone,
                address: donorAddress,
                panNumber
            });
        } else {
            // Update donor info if provided
            if (donorPhone) donor.phone = donorPhone;
            if (panNumber) donor.panNumber = panNumber;
            if (donorAddress) donor.address = donorAddress;
            await donor.save();
        }

        // Create Razorpay order
        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `donation_${Date.now()}`,
            notes: {
                donorId: donor._id.toString(),
                programId: programId || '',
                type
            }
        };

        const order = await razorpay.orders.create(options);

        // Create pending donation record
        const donation = await Donation.create({
            donor: donor._id,
            program: programId || undefined,
            amount,
            type,
            razorpayOrderId: order.id,
            status: 'pending',
            isAnonymous,
            dedicatedTo,
            campaign
        });

        res.status(201).json({
            success: true,
            data: {
                orderId: order.id,
                donationId: donation._id,
                amount: order.amount,
                currency: order.currency,
                keyId: process.env.RAZORPAY_KEY_ID
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify payment and complete donation
// @route   POST /api/donations/verify
// @access  Public
exports.verifyPayment = async (req, res, next) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            donationId
        } = req.body;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }

        // Update donation record
        const donation = await Donation.findById(donationId);

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        donation.razorpayPaymentId = razorpay_payment_id;
        donation.razorpaySignature = razorpay_signature;
        donation.transactionId = razorpay_payment_id;
        donation.status = 'completed';
        donation.receipt = {
            number: `RCP-${Date.now()}`,
            generatedAt: new Date()
        };
        await donation.save();

        // Update donor stats
        await Donor.findByIdAndUpdate(donation.donor, {
            $inc: {
                totalDonated: donation.amount,
                donationCount: 1
            },
            isRecurringDonor: donation.type !== 'one-time'
        });

        // Update program if donation is for specific program
        if (donation.program) {
            await Program.findByIdAndUpdate(donation.program, {
                $inc: {
                    raisedAmount: donation.amount,
                    donorCount: 1
                }
            });
        }

        // Send email receipt
        const donor = await Donor.findById(donation.donor);
        const program = donation.program ? await Program.findById(donation.program) : null;

        await sendDonationReceipt(donor, donation, program);

        res.json({
            success: true,
            message: 'Payment verified successfully',
            data: {
                donationId: donation._id,
                receiptNumber: donation.receipt.number,
                amount: donation.amount
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all donations
// @route   GET /api/donations
// @access  Private
exports.getDonations = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            type,
            programId,
            startDate,
            endDate,
            minAmount,
            maxAmount
        } = req.query;

        const query = {};

        if (status) query.status = status;
        if (type) query.type = type;
        if (programId) query.program = programId;

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        if (minAmount || maxAmount) {
            query.amount = {};
            if (minAmount) query.amount.$gte = parseFloat(minAmount);
            if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
        }

        const donations = await Donation.find(query)
            .populate('donor', 'name email phone')
            .populate('program', 'title')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Donation.countDocuments(query);

        res.json({
            success: true,
            data: donations,
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

// @desc    Get single donation
// @route   GET /api/donations/:id
// @access  Private
exports.getDonation = async (req, res, next) => {
    try {
        const donation = await Donation.findById(req.params.id)
            .populate('donor')
            .populate('program');

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        res.json({
            success: true,
            data: donation
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get donation statistics
// @route   GET /api/donations/stats
// @access  Private
exports.getDonationStats = async (req, res, next) => {
    try {
        const { period = 'month' } = req.query;

        const now = new Date();
        let startDate;

        switch (period) {
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                startDate = new Date(0);
        }

        const stats = await Donation.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    totalCount: { $sum: 1 },
                    avgAmount: { $avg: '$amount' }
                }
            }
        ]);

        const byProgram = await Donation.aggregate([
            {
                $match: {
                    status: 'completed',
                    program: { $exists: true }
                }
            },
            {
                $group: {
                    _id: '$program',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'programs',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'program'
                }
            },
            {
                $unwind: '$program'
            },
            {
                $project: {
                    programTitle: '$program.title',
                    total: 1,
                    count: 1
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                summary: stats[0] || { totalAmount: 0, totalCount: 0, avgAmount: 0 },
                byProgram
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Export donations
// @route   GET /api/donations/export
// @access  Private
exports.exportDonations = async (req, res, next) => {
    try {
        const { startDate, endDate, status } = req.query;

        const query = { status: status || 'completed' };

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const donations = await Donation.find(query)
            .populate('donor', 'name email phone panNumber')
            .populate('program', 'title')
            .sort({ createdAt: -1 });

        const csvHeader = 'Receipt No,Donor Name,Email,Phone,PAN,Amount,Type,Program,Transaction ID,Date\n';
        const csvData = donations.map(d =>
            `"${d.receipt?.number || ''}","${d.donor?.name || ''}","${d.donor?.email || ''}","${d.donor?.phone || ''}","${d.donor?.panNumber || ''}",${d.amount},"${d.type}","${d.program?.title || 'General'}","${d.transactionId || ''}","${d.createdAt.toISOString()}"`
        ).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=donations-export.csv');
        res.send(csvHeader + csvData);
    } catch (error) {
        next(error);
    }
};
