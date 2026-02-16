'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Mail, Phone, Filter, Eye, User, DollarSign, Users } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function DonorsPage() {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalDonors: 0,
        recurringDonors: 0,
        totalDonationsAmount: 0
    });
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchDonors();
        fetchStats();
    }, []);

    const fetchDonors = async () => {
        try {
            const res = await api.get('/donors', {
                params: { search }
            });
            setDonors(res.data.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch donors');
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/donors/stats');
            setStats(res.data.data);
        } catch (error) {
            console.error('Failed to fetch donor stats');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDonors();
    };

    const handleExport = async () => {
        try {
            const res = await api.get('/donors/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `donors-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Failed to export donors');
        }
    };

    if (loading) return <div className="p-8 text-center text-white/50">Loading donors...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-white">Donor CRM</h1>
                    <p className="text-white/50">Manage donor relationships and contributions</p>
                </div>
                <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Export CSV
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-white/50 text-sm">Total Donors</p>
                            <p className="text-2xl font-heading font-bold text-white">{stats.totalDonors}</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 text-green-400 rounded-lg">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-white/50 text-sm">Total Raised</p>
                            <p className="text-2xl font-heading font-bold text-green-400">{formatCurrency(stats.totalDonationsAmount)}</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 text-purple-400 rounded-lg">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-white/50 text-sm">Recurring Donors</p>
                            <p className="text-2xl font-heading font-bold text-white">{stats.recurringDonors}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="glass-card p-4">
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search donors by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-12"
                    />
                </form>
            </div>

            {/* Donors Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="text-left py-4 px-6 text-white/50 font-medium whitespace-nowrap">Donor Details</th>
                                <th className="text-left py-4 px-6 text-white/50 font-medium whitespace-nowrap">Contact</th>
                                <th className="text-left py-4 px-6 text-white/50 font-medium whitespace-nowrap">Total Donated</th>
                                <th className="text-left py-4 px-6 text-white/50 font-medium whitespace-nowrap">Donations</th>
                                <th className="text-left py-4 px-6 text-white/50 font-medium whitespace-nowrap">Last Activity</th>
                                <th className="text-right py-4 px-6 text-white/50 font-medium whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {donors.length > 0 ? (
                                donors.map((donor) => (
                                    <tr key={donor._id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
                                                    {donor.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{donor.name}</p>
                                                    <p className="text-white/30 text-xs">ID: {donor._id.slice(-6).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm">
                                            <p className="text-white/70">{donor.email}</p>
                                            <p className="text-white/40">{donor.phone || '-'}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-green-400 font-semibold">{formatCurrency(donor.totalDonated)}</span>
                                        </td>
                                        <td className="py-4 px-6 text-white/70">{donor.donationCount || 0}</td>
                                        <td className="py-4 px-6 text-white/50 text-sm">
                                            {new Date(donor.updatedAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white" title="View Details">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <a href={`mailto:${donor.email}`} className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white" title="Send Email">
                                                    <Mail className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-white/30">
                                        No donors found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
