const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const Volunteer = require('../models/Volunteer');
const Blog = require('../models/Blog');

// @route   GET /api/dashboard/stats
// @desc    Get aggregated stats for dashboard
// @access  Admin
router.get('/stats', async (req, res) => {
    try {
        // 1. Total Donations Amount
        const totalDonationsResult = await Donation.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalDonations = totalDonationsResult.length > 0 ? totalDonationsResult[0].total : 0;

        // 2. Total Donors Count
        const totalDonors = await Donor.countDocuments();

        // 3. Active Volunteers Count
        const activeVolunteers = await Volunteer.countDocuments({ status: 'active' });

        // 4. Lives Impacted (This is usually a manual estimate or calculation, using a placeholder/managed setting would be better, but for now hardcode/calc)
        // Let's assume 1 donation impacts 1 life for simplicity + a base number
        const livesImpacted = 5000 + await Donation.countDocuments({ status: 'completed' });

        // 5. Recent Donations
        const recentDonations = await Donation.find({ status: 'completed' })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('donor', 'name email')
            .populate('program', 'title');

        // 6. Recent Blogs
        const recentBlogs = await Blog.find()
            .sort({ createdAt: -1 })
            .limit(5);

        // 7. Monthly Growth (Simple calculation: this month vs last month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const startOfLastMonth = new Date(startOfMonth);
        startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

        const currentMonthDonations = await Donation.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const lastMonthDonations = await Donation.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const currentMonthTotal = currentMonthDonations[0]?.total || 0;
        const lastMonthTotal = lastMonthDonations[0]?.total || 0;

        let monthlyGrowth = 0;
        if (lastMonthTotal > 0) {
            monthlyGrowth = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
        } else if (currentMonthTotal > 0) {
            monthlyGrowth = 100;
        }

        res.json({
            success: true,
            data: {
                stats: {
                    totalDonations,
                    totalDonors,
                    activeVolunteers,
                    livesImpacted,
                    monthlyGrowth: parseFloat(monthlyGrowth.toFixed(1))
                },
                recentDonations,
                recentBlogs
            }
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
