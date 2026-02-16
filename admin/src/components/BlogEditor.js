'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, X, Image as ImageIcon, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import api, { blogsApi } from '@/lib/api';

export default function BlogEditor({ blogId = null }) {
    const router = useRouter();
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(blogId ? true : false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'stories',
        status: 'draft',
        author: '',
        featuredImage: null
    });

    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (blogId) {
            fetchBlog();
        }
    }, [blogId]);

    const fetchBlog = async () => {
        try {
            const res = await blogsApi.get(blogId);
            const blog = res.data.data;
            setFormData({
                title: blog.title,
                excerpt: blog.excerpt || '',
                content: blog.content,
                category: blog.category,
                status: blog.status,
                author: blog.author || '',
                featuredImage: null // Use preview for existing image
            });
            if (blog.featuredImage?.url) {
                setPreviewImage(blog.featuredImage.url);
            }
        } catch (error) {
            toast.error('Failed to load blog post');
            router.push('/dashboard/blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, featuredImage: file }));
            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.content) {
            toast.error('Title and Content are required');
            return;
        }

        setSaving(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'featuredImage') {
                    if (formData.featuredImage) {
                        data.append('featuredImage', formData.featuredImage);
                    }
                } else {
                    data.append(key, formData[key]);
                }
            });

            if (blogId) {
                await blogsApi.update(blogId, data);
                toast.success('Blog post updated successfully');
            } else {
                await blogsApi.create(data);
                toast.success('Blog post created successfully');
            }

            router.push('/dashboard/blogs');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to save blog post');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-mars-orange" /></div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/blogs" className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-white">
                            {blogId ? 'Edit Blog Post' : 'Create New Blog Post'}
                        </h1>
                        <p className="text-white/50 text-sm">
                            {blogId ? 'Update your story and impact' : 'Share a new story of impact'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/dashboard/blogs" className="btn-secondary">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {blogId ? 'Update Post' : 'Publish Post'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className="glass-card p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">Blog Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter an engaging title..."
                                className="input-field text-lg font-bold"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">Excerpt (Optional)</label>
                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleInputChange}
                                placeholder="Brief summary for cards and SEO..."
                                className="input-field min-h-[80px]"
                                maxLength={200}
                            />
                            <p className="text-xs text-white/30 text-right">{formData.excerpt.length}/200</p>
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div className="glass-card p-6 flex flex-col h-[500px]">
                        <label className="block text-sm font-medium text-white/70 mb-2">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            placeholder="Write your story here... (Markdown supported)"
                            className="input-field flex-1 font-mono text-sm leading-relaxed p-4"
                            required
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status & Category */}
                    <div className="glass-card p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="input-field"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="input-field capitalize"
                            >
                                <option value="stories">Success Stories</option>
                                <option value="education">Education</option>
                                <option value="health">Healthcare</option>
                                <option value="environment">Environment</option>
                                <option value="events">Events</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Author</label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleInputChange}
                                placeholder="Author Name"
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="glass-card p-6">
                        <label className="block text-sm font-medium text-white/70 mb-4">Featured Image</label>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                                relative aspect-video rounded-xl border-2 border-dashed border-white/10 
                                flex flex-col items-center justify-center cursor-pointer
                                hover:border-mars-orange/50 hover:bg-white/5 transition-all
                                group overflow-hidden
                            `}
                        >
                            {previewImage ? (
                                <>
                                    <Image
                                        src={previewImage}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white text-sm font-medium">Click to Change</p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="w-6 h-6 text-white/50 group-hover:text-mars-orange" />
                                    </div>
                                    <p className="text-sm text-white/70 font-medium">Click to upload</p>
                                    <p className="text-xs text-white/30 mt-1">JPG, PNG up to 5MB</p>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
