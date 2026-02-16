'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check, X, Mail, MessageCircle, Briefcase,
    MoreVertical, User, Calendar, MapPin,
    ChevronRight, Clock, Shield, Search
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function VolunteersPage() {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [programs, setPrograms] = useState([]);

    // Assignment Form State
    const [assignment, setAssignment] = useState({
        programId: '',
        task: '',
        description: '',
        dueDate: '',
        notes: '',
        notifyEmail: true
    });

    useEffect(() => {
        fetchVolunteers();
        fetchPrograms();
    }, []);

    const fetchVolunteers = async () => {
        try {
            const res = await api.get('/volunteers');
            setVolunteers(res.data.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch volunteers');
            setLoading(false);
        }
    };

    const fetchPrograms = async () => {
        try {
            const res = await api.get('/programs?limit=100');
            setPrograms(res.data.data);
        } catch (error) {
            console.error('Failed to fetch programs');
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.put(`/volunteers/${id}/approve`);
            toast.success('Volunteer approved & email sent!');
            fetchVolunteers();
        } catch (error) {
            toast.error('Failed to approve volunteer');
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/volunteers/${selectedVolunteer._id}/assign`, assignment);
            toast.success('Task assigned successfully!');
            setShowAssignModal(false);
            setAssignment({
                programId: '',
                task: '',
                description: '',
                dueDate: '',
                notes: '',
                notifyEmail: true
            });
        } catch (error) {
            toast.error('Failed to assign task');
        }
    };

    const openAssignModal = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setShowAssignModal(true);
    };

    const sendWhatsApp = (volunteer) => {
        const text = `Hi ${volunteer.name}, this is from Mars Care Foundation. We would like to discuss volunteer opportunities with you.`;
        window.open(`https://wa.me/${volunteer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
    };

    if (loading) return <div className="p-8 text-center text-white/50">Loading volunteers...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-white">Volunteers Management</h1>
                    <p className="text-white/50">Review applications and assign tasks</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/50 text-sm">Total:</span>
                    <span className="text-white font-bold">{volunteers.length}</span>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="py-4 px-6 text-white/50 font-medium whitespace-nowrap">Volunteer</th>
                                <th className="py-4 px-6 text-white/50 font-medium whitespace-nowrap">Skills & Interest</th>
                                <th className="py-4 px-6 text-white/50 font-medium whitespace-nowrap">Availability</th>
                                <th className="py-4 px-6 text-white/50 font-medium whitespace-nowrap">Status</th>
                                <th className="py-4 px-6 text-right text-white/50 font-medium whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {volunteers.map((v) => (
                                <tr key={v._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{v.name}</p>
                                                <p className="text-white/40 text-xs">{v.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-wrap gap-1">
                                            {v.skills?.slice(0, 2).map((skill, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                                                    {skill}
                                                </span>
                                            ))}
                                            {v.skills?.length > 2 && (
                                                <span className="text-[10px] text-white/30 flex items-center">+{v.skills.length - 2}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm text-white/70 capitalize">{v.availability}</div>
                                        <div className="text-[10px] text-white/30">{v.hoursPerWeek}h/week</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${v.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                v.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                    'bg-white/5 text-white/30 border-white/10'
                                            }`}>
                                            {v.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {v.status === 'pending' && (
                                                <button
                                                    onClick={() => handleApprove(v._id)}
                                                    className="p-2 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20 hover:bg-green-500/20"
                                                    title="Approve"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => openAssignModal(v)}
                                                className="p-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20 hover:bg-purple-500/20"
                                                title="Assign Task"
                                            >
                                                <Briefcase className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => sendWhatsApp(v)}
                                                className="p-2 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20 hover:bg-green-500/20"
                                                title="WhatsApp"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                            </button>
                                            <a
                                                href={`mailto:${v.email}`}
                                                className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 hover:bg-blue-500/20"
                                            >
                                                <Mail className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assignment Modal */}
            <AnimatePresence>
                {showAssignModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card w-full max-w-md p-6 border-white/20 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Assign Mission</h3>
                                    <p className="text-white/50 text-xs">Target: {selectedVolunteer?.name}</p>
                                </div>
                                <button onClick={() => setShowAssignModal(false)} className="text-white/30 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleAssign} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5">Mission Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        value={assignment.task}
                                        onChange={(e) => setAssignment({ ...assignment, task: e.target.value })}
                                        placeholder="e.g. Community Outreach"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5">Program</label>
                                    <select
                                        className="input-field appearance-none"
                                        value={assignment.programId}
                                        onChange={(e) => setAssignment({ ...assignment, programId: e.target.value })}
                                    >
                                        <option value="" className="bg-gray-900">Select Field Program</option>
                                        {programs.map(p => (
                                            <option key={p._id} value={p._id} className="bg-gray-900">{p.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5">Briefing</label>
                                    <textarea
                                        className="input-field min-h-[100px] py-3"
                                        value={assignment.description}
                                        onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
                                        placeholder="Detailed instructions..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5">Deadline</label>
                                        <input
                                            type="date"
                                            className="input-field"
                                            value={assignment.dueDate}
                                            onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={assignment.notifyEmail}
                                                    onChange={(e) => setAssignment({ ...assignment, notifyEmail: e.target.checked })}
                                                    className="sr-only"
                                                />
                                                <div className={`w-10 h-5 rounded-full transition-colors ${assignment.notifyEmail ? 'bg-primary-500' : 'bg-white/10'}`}></div>
                                                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${assignment.notifyEmail ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                            </div>
                                            Email Intel
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAssignModal(false)}
                                        className="flex-1 py-3 px-4 bg-white/5 text-white/70 rounded-xl hover:bg-white/10 border border-white/10 transition-colors font-medium text-sm"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-colors font-bold text-sm"
                                    >
                                        Deploy Task
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
