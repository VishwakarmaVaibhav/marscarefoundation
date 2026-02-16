'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, CreditCard, Heart, TrendingUp,
    ArrowUpRight, ArrowDownRight, Calendar,
    UserCheck, FileText, Eye
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

// Sample data for charts
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
        totalDonations: 1250000,
        totalDonors: 1250,
        activeVolunteers: 85,
        livesImpacted: 50000,
        monthlyGrowth: 12.5,
        donorGrowth: 8.3,
    });

    const [recentDonations, setRecentDonations] = useState([
        { id: 1, donor: 'Rahul Sharma', amount: 5000, program: 'Education', date: '2 hours ago' },
        { id: 2, donor: 'Priya Patel', amount: 2500, program: 'Healthcare', date: '5 hours ago' },
        { id: 3, donor: 'Anonymous', amount: 10000, program: 'General Fund', date: '1 day ago' },
        { id: 4, donor: 'Amit Kumar', amount: 1000, program: 'Child Welfare', date: '1 day ago' },
    ]);

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
            change: stats.donorGrowth,
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
                            {stat.change && (
                                <div className={`flex items-center gap-1 text-sm ${stat.change > 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {stat.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    {Math.abs(stat.change)}%
                                </div>
                            )}
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-white">{stat.value}</h3>
                        <p className="text-white/50 text-sm">{stat.title}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
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

                {/* Program Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6"
                >
                    <h3 className="font-heading font-semibold text-white mb-6">Donations by Program</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={programData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" width={100} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1a1a2e',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value) => [formatCurrency(value), 'Donations']}
                                />
                                <Bar dataKey="donations" fill="#FF6B35" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Recent Donations Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading font-semibold text-white">Recent Donations</h3>
                    <a href="/dashboard/donations" className="text-mars-orange hover:underline text-sm">View All</a>
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
                            {recentDonations.map((donation) => (
                                <tr key={donation.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="py-4 text-white">{donation.donor}</td>
                                    <td className="py-4 text-green-400 font-semibold">{formatCurrency(donation.amount)}</td>
                                    <td className="py-4 text-white/70">{donation.program}</td>
                                    <td className="py-4 text-white/50">{donation.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'New Blog Post', href: '/dashboard/blogs/new', icon: FileText },
                    { label: 'Add Program', href: '/dashboard/programs/new', icon: Heart },
                    { label: 'Upload Gallery', href: '/dashboard/gallery', icon: Eye },
                    { label: 'View Reports', href: '/dashboard/donations', icon: TrendingUp },
                ].map((action) => (
                    <a
                        key={action.label}
                        href={action.href}
                        className="glass-card p-4 flex items-center gap-3 hover:bg-white/10 transition-colors"
                    >
                        <action.icon className="w-5 h-5 text-mars-orange" />
                        <span className="text-white font-medium">{action.label}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}
