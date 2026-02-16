'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function BlogModal({ blog, isOpen, onClose }) {
    if (!blog) return null;

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/blogs/${blog.slug}` : '';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden glass-card shadow-2xl flex flex-col md:flex-row bg-white/90"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/20 backdrop-blur hover:bg-white/40 transition-all text-primary"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Image Section (Desktop) */}
                        <div className="hidden md:block w-1/2 relative h-full">
                            <img
                                src={blog.featuredImage?.url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070'}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex flex-col justify-end p-8">
                                <span className="px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full w-fit mb-4 uppercase tracking-widest">
                                    {blog.category || 'Humanity'}
                                </span>
                                <h2 className="font-playfair text-4xl text-white font-bold leading-tight">
                                    {blog.title}
                                </h2>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-1/2 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                            {/* Mobile Image */}
                            <div className="md:hidden relative h-64 -mx-6 -mt-6 mb-6">
                                <img
                                    src={blog.featuredImage?.url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070'}
                                    alt={blog.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </div>

                            <div className="md:hidden mb-6">
                                <span className="px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full w-fit mb-2 uppercase tracking-widest block">
                                    {blog.category || 'Humanity'}
                                </span>
                                <h2 className="font-playfair text-3xl font-bold text-primary leading-tight">
                                    {blog.title}
                                </h2>
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-secondary" />
                                    <span>{blog.author?.name || 'Mars Team'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-secondary" />
                                    <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-secondary" />
                                    <span>{blog.readingTime || '5 min'} read</span>
                                </div>
                            </div>

                            {/* Blog Text */}
                            <div
                                className="prose prose-mars max-w-none text-gray-600 leading-relaxed font-outfit"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />

                            {/* Social Share */}
                            <div className="mt-12 pt-8 border-t border-gray-100">
                                <h4 className="font-heading font-bold text-primary mb-4 flex items-center gap-2">
                                    <Share2 className="w-4 h-4" /> Share this story
                                </h4>
                                <div className="flex items-center gap-3">
                                    <button onClick={handleCopyLink} className="p-3 rounded-full bg-gray-100 hover:bg-secondary hover:text-white transition-all">
                                        <LinkIcon className="w-5 h-5" />
                                    </button>
                                    <a href={`https://facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener" className="p-3 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white transition-all">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} target="_blank" rel="noopener" className="p-3 rounded-full bg-gray-100 hover:bg-sky-500 hover:text-white transition-all">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>

                            {/* Newsletter Hook */}
                            <div className="mt-12 bg-primary/5 rounded-2xl p-6 border border-primary/10">
                                <h4 className="font-heading font-bold text-primary mb-2">Subscribe to our newsletter</h4>
                                <p className="text-sm text-gray-500 mb-4">Stay updated with our latest stories and impact reports.</p>
                                <div className="flex gap-2">
                                    <input type="email" placeholder="Enter your email" className="flex-grow px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-secondary text-sm" />
                                    <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-secondary transition-all">Join</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
