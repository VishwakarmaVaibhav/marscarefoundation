'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Search, Filter, DollarSign, Calendar, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function DonationsPage() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalAmount: 0, totalCount: 0, avgAmount: 0 });
    const [filter, setFilter] = useState({
        status: '',
        search: ''
    });

    useEffect(() => {
        fetchDonations();
        fetchStats();
    }, [filter]);

    const fetchDonations = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (filter.status) queryParams.append('status', filter.status);

            const res = await api.get(`/donations?${queryParams.toString()}`);
            setDonations(res.data.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch donations');
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/donations/stats');
            setStats(res.data.data.summary);
        } catch (error) {
            console.error('Failed to fetch stats');
        }
    };

    const handleExport = async () => {
        try {
            const res = await api.get('/donations/export', {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `donations-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Failed to export donations');
        }
    };

    if (loading) return <div className="p-8 text-center text-white/50">Loading ledger...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-white">Donations Ledger</h1>
                    <p className="text-white/50">Real-time tracking of humanitarian funding</p>
                </div>
                <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Export Detailed CSV
                </button>
            </div>

            {/* Stats Overlay */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-l-4 border-l-primary-500">
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Total Funding</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-heading font-extrabold text-white">{formatCurrency(stats.totalAmount)}</span>
                        <TrendingUp className="w-4 h-4 text-green-400" />
                    </div>
                </div>
                <div className="glass-card p-6">
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Total Impact Count</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-heading font-extrabold text-white">{stats.totalCount}</span>
                        <span className="text-white/30 text-xs italic">txns</span>
                    </div>
                </div>
                <div className="glass-card p-6">
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Avg contribution</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-heading font-extrabold text-white">{formatCurrency(stats.avgAmount)}</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="glass-card p-4 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search by donor or receipt..."
                        className="input-field pl-12"
                        disabled
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-white/30" />
                    <select
                        className="input-field py-2 text-sm bg-transparent w-auto px-4"
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                    >
                        <option value="" className="bg-gray-900">All Status</option>
                        <option value="completed" className="bg-gray-900">Completed</option>
                        <option value="pending" className="bg-gray-900">Pending</option>
                        <option value="failed" className="bg-gray-900">Failed</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="py-4 px-6 text-white/50 font-medium text-xs uppercase tracking-wider">Source</th>
                                <th className="py-4 px-6 text-white/50 font-medium text-xs uppercase tracking-wider">Amount</th>
                                <th className="py-4 px-6 text-white/50 font-medium text-xs uppercase tracking-wider">Program Allocation</th>
                                <th className="py-4 px-6 text-white/50 font-medium text-xs uppercase tracking-wider">Timeline</th>
                                <th className="py-4 px-6 text-white/50 font-medium text-xs uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 text-white/50 font-medium text-xs uppercase tracking-wider">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {donations.length > 0 ? (
                                donations.map((d) => (
                                    <tr key={d._id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="text-white font-medium">{d.donor?.name || 'Anonymous'}</div>
                                            <div className="text-[10px] text-white/30 truncate max-w-[150px]">{d.donor?.email}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-white font-bold">{formatCurrency(d.amount)}</div>
                                            <div className="text-[10px] text-white/40 uppercase tracking-tighter">{d.type}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-xs text-white/70">{d.program?.title || 'General Fund'}</div>
                                            {d.dedicatedTo?.name && (
                                                <div className="text-[10px] text-accent-400 italic">In honor of {d.dedicatedTo.name}</div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-xs text-white/50 flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" />
                                                {new Date(d.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${d.status === 'completed' ? 'text-green-400' :
                                                    d.status === 'failed' ? 'text-red-400' :
                                                        'text-yellow-400'
                                                }`}>
                                                {d.status === 'completed' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                {d.status}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-xs font-mono text-white/30">
                                            {d.receipt?.number || 'PENDING'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-white/20 italic">
                                        No transactions recorded for the selected criteria.
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
