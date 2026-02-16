'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, CreditCard, Heart, TrendingUp,
    ArrowUpRight, ArrowDownRight, Calendar,
    UserCheck, FileText, Eye, Loader2
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import api, { dashboardApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

// Helper to format date relative
const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

// Placeholder data for charts until we implement advanced aggregation
const donationData = [
    { name: 'Jan', amount: 45000 },
    { name: 'Feb', amount: 52000 },
    { name: 'Mar', amount: 48000 },
    { name: 'Apr', amount: 61000 },
    { name: 'May', amount: 55000 },
    { name: 'Jun', amount: 72000 },
];

const programData = [
    { name: 'Education', donations: 450000 },
    { name: 'Healthcare', donations: 320000 },
    { name: 'Women Emp.', donations: 180000 },
    { name: 'Child Welfare', donations: 150000 },
];

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalDonations: 0,
        totalDonors: 0,
        activeVolunteers: 0,
        livesImpacted: 0,
        monthlyGrowth: 0
    });

    const [recentDonations, setRecentDonations] = useState([]);
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await dashboardApi.getStats();
                const data = res.data.data;
                setStats(data.stats);
                setRecentDonations(data.recentDonations);
                setRecentBlogs(data.recentBlogs);
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        {
            title: 'Total Donations',
            value: formatCurrency(stats.totalDonations),
            change: stats.monthlyGrowth,
            icon: CreditCard,
            color: 'from-green-400 to-green-600'
        },
        {
            title: 'Total Donors',
            value: stats.totalDonors.toLocaleString(),
            icon: Users,
            color: 'from-blue-400 to-blue-600'
        },
        {
            title: 'Active Volunteers',
            value: stats.activeVolunteers,
            icon: UserCheck,
            color: 'from-purple-400 to-purple-600'
        },
        {
            title: 'Lives Impacted',
            value: stats.livesImpacted.toLocaleString() + '+',
            icon: Heart,
            color: 'from-mars-orange to-mars-red'
        },
    ];

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-mars-orange" /></div>;

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-6"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            {stat.change !== undefined && (
                                <div className={`flex items-center gap-1 text-sm ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {stat.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    {Math.abs(stat.change)}%
                                </div>
                            )}
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-white">{stat.value}</h3>
                        <p className="text-white/50 text-sm">{stat.title}</p>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Left Column - Charts & Donations */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Donations Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-heading font-semibold text-white">Donation Trends</h3>
                            <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm">
                                <option>Last 6 months</option>
                                <option>Last year</option>
                            </select>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={donationData}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                                    <YAxis stroke="rgba(255,255,255,0.5)" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1a1a2e',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value) => [formatCurrency(value), 'Amount']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#FF6B35"
                                        fillOpacity={1}
                                        fill="url(#colorAmount)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Recent Donations Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass-card p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-heading font-semibold text-white">Recent Donations</h3>
                            <Link href="/dashboard/donations" className="text-mars-orange hover:underline text-sm">View All</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-3 text-white/50 font-medium">Donor</th>
                                        <th className="text-left py-3 text-white/50 font-medium">Amount</th>
                                        <th className="text-left py-3 text-white/50 font-medium">Program</th>
                                        <th className="text-left py-3 text-white/50 font-medium">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentDonations.length > 0 ? recentDonations.map((donation) => (
                                        <tr key={donation._id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="py-4 text-white">{donation.donor?.name || 'Anonymous'}</td>
                                            <td className="py-4 text-green-400 font-semibold">{formatCurrency(donation.amount)}</td>
                                            <td className="py-4 text-white/70">{donation.program?.title || 'General Fund'}</td>
                                            <td className="py-4 text-white/50 text-sm">{timeAgo(donation.createdAt)}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-white/50">No recent donations</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Quick Actions & Recent Blogs */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'New Blog Post', href: '/dashboard/blogs/new', icon: FileText },
                            { label: 'Add Program', href: '/dashboard/programs/new', icon: Heart },
                            { label: 'Upload Gallery', href: '/dashboard/gallery', icon: Eye },
                            { label: 'View Reports', href: '/dashboard/donations', icon: TrendingUp },
                        ].map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className="glass-card p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-colors text-center h-28"
                            >
                                <div className="p-2 rounded-full bg-mars-orange/10 text-mars-orange">
                                    <action.icon className="w-6 h-6" />
                                </div>
                                <span className="text-white font-medium text-sm">{action.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Recent Blogs */}
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-heading font-semibold text-white">Recent Blogs</h3>
                            <Link href="/dashboard/blogs" className="text-mars-orange hover:underline text-sm">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {recentBlogs.length > 0 ? recentBlogs.map((blog) => (
                                <Link key={blog._id} href={`/dashboard/blogs/${blog._id}`} className="block group">
                                    <div className="flex gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors">
                                        <div className="w-16 h-16 rounded-lg bg-white/10 overflow-hidden flex-shrink-0 relative">
                                            {blog.featuredImage?.url ? (
                                                <img src={blog.featuredImage.url} alt={blog.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/30">
                                                    <FileText size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-medium truncate group-hover:text-mars-orange transition-colors">{blog.title}</h4>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${blog.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {blog.status}
                                                </span>
                                                <span className="text-white/40 text-xs">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )) : (
                                <p className="text-white/50 text-center py-4">No blogs yet</p>
                            )}
                        </div>
                        <Link href="/dashboard/blogs/new" className="mt-4 w-full btn-secondary text-sm flex items-center justify-center gap-2">
                            <FileText size={16} /> Create New Post
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
