'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Newspaper, Plus } from 'lucide-react';
import { blogsApi } from '@/lib/api';
import BlogModal from './BlogModal';

export default function BlogSection() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await blogsApi.getAll({ limit: 3, status: 'published' });
            if (res.data.data) {
                setBlogs(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch blogs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlogClick = (blog) => {
        setSelectedBlog(blog);
        setIsModalOpen(true);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 20
            }
        }
    };

    return (
        <section className="relative py-32 px-4 md:px-0 overflow-hidden bg-white">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/[0.02] -skew-x-12 transform translate-x-1/2" />

            <div className="container-custom relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-12 h-[2px] bg-secondary" />
                            <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">Stories of Change</span>
                        </div>
                        <h2 className="font-playfair text-5xl md:text-7xl font-bold text-primary leading-tight">
                            Latest from <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">Mars Chronicles</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-4"
                    >
                        <p className="text-gray-500 font-outfit max-w-[300px] text-sm leading-relaxed">
                            Discover the human stories behind our missions and how your support transforms lives every day.
                        </p>
                        <button className="group flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase hover:text-secondary transition-colors">
                            Explore All Stories
                            <Plus className="w-4 h-4 transform group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-3 gap-10">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-3xl" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-10"
                    >
                        {blogs.map((blog, index) => (
                            <motion.div
                                key={blog._id}
                                variants={itemVariants}
                                onClick={() => handleBlogClick(blog)}
                                className="group cursor-pointer"
                            >
                                <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden mb-8 shadow-xl">
                                    <img
                                        src={blog.featuredImage?.url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070'}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />

                                    <div className="absolute top-6 left-6">
                                        <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold tracking-widest uppercase border border-white/20">
                                            {blog.category || 'Impact'}
                                        </span>
                                    </div>

                                    <div className="absolute bottom-10 left-10 right-10">
                                        <div className="flex items-center gap-4 text-white/60 text-[10px] font-bold tracking-widest uppercase mb-4">
                                            <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 bg-secondary rounded-full" />
                                            <span>{blog.readingTime || '5 MIN Read'}</span>
                                        </div>
                                        <h3 className="font-playfair text-2xl text-white font-bold leading-tight group-hover:text-secondary transition-colors">
                                            {blog.title}
                                        </h3>
                                    </div>

                                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-500">
                                            <ArrowUpRight className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

            </div>

            <BlogModal
                blog={selectedBlog}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>
    );
}
