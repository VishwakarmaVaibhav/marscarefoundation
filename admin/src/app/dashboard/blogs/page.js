'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, Filter, Send } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ConfirmModal';
import Loader from '@/components/Loader';

export default function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Sender State
    const [sendingId, setSendingId] = useState(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await api.get('/blogs');
            setBlogs(res.data.data || []);
        } catch (error) {
            toast.error('Failed to fetch blogs');
        } finally {
            setLoading(false);
        }
    };

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || blog.status === filter;
        return matchesSearch && matchesFilter;
    });

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            await api.delete(`/blogs/${itemToDelete}`);
            setBlogs(blogs.filter(b => b._id !== itemToDelete));
            toast.success('Blog deleted successfully');
            setDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            toast.error('Failed to delete blog');
        }
    };

    const handleSendNewsletter = async (blogId) => {
        if (sendingId) return;
        setSendingId(blogId);
        try {
            await api.post('/newsletter/send', { blogId });
            toast.success('Newsletter sent successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send newsletter');
        } finally {
            setSendingId(null);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Loader size="large" /></div>;

    return (
        <div className="space-y-6">
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Blog"
                message="Are you sure you want to delete this blog post? This action cannot be undone."
                isDangerous={true}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-white">Blog Manager</h1>
                    <p className="text-white/50">Create and manage blog posts</p>
                </div>
                <Link href="/dashboard/blogs/new" className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    New Blog Post
                </Link>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-12"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="input-field w-full sm:w-48"
                >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            {/* Blog List */}
            <div className="glass-card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="text-left py-4 px-6 text-white/50 font-medium">Title</th>
                            <th className="text-left py-4 px-6 text-white/50 font-medium">Category</th>
                            <th className="text-left py-4 px-6 text-white/50 font-medium">Status</th>
                            <th className="text-left py-4 px-6 text-white/50 font-medium">Views</th>
                            <th className="text-left py-4 px-6 text-white/50 font-medium">Date</th>
                            <th className="text-right py-4 px-6 text-white/50 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBlogs.map((blog) => (
                            <tr key={blog._id} className="border-t border-white/5 hover:bg-white/5">
                                <td className="py-4 px-6">
                                    <span className="text-white font-medium">{blog.title}</span>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="text-white/70 capitalize">{blog.category?.replace('-', ' ') || 'Uncategorized'}</span>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${blog.status === 'published'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {blog.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-white/70">{blog.viewCount || 0}</td>
                                <td className="py-4 px-6 text-white/50">{new Date(blog.createdAt).toLocaleDateString()}</td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/dashboard/blogs/${blog._id}`} className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white">
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleSendNewsletter(blog._id)}
                                            disabled={sendingId === blog._id}
                                            className="p-2 hover:bg-blue-500/20 rounded-lg text-white/50 hover:text-blue-400 relative"
                                            title="Send as Newsletter"
                                        >
                                            {sendingId === blog._id ? (
                                                <Loader className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Send className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button onClick={() => confirmDelete(blog._id)} className="p-2 hover:bg-red-500/20 rounded-lg text-white/50 hover:text-red-400">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBlogs.length === 0 && (
                    <div className="text-center py-12 text-white/50">
                        No blogs found
                    </div>
                )}
            </div>
        </div>
    );
}
