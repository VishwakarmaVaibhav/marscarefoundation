'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        order: 0,
        isActive: true
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/program-categories/admin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch categories', error);
            toast.error('Failed to fetch categories');
            setLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const token = localStorage.getItem('token');

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('order', formData.order);
        data.append('isActive', formData.isActive);
        if (selectedFile) data.append('image', selectedFile);

        try {
            if (isEditing) {
                await axios.put(`${API_URL}/program-categories/${currentId}`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Category updated successfully');
            } else {
                await axios.post(`${API_URL}/program-categories`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Category created successfully');
            }
            fetchCategories();
            closeModal();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Operation failed');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This might affect programs linked to this category.')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/program-categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Category deleted');
            setCategories(categories.filter(c => c._id !== id));
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    const openEditModal = (category) => {
        setFormData({
            title: category.title,
            description: category.description || '',
            order: category.order || 0,
            isActive: category.isActive
        });
        setPreviewUrl(category.image?.url ? (category.image.url.startsWith('http') ? category.image.url : `${API_URL.replace('/api', '')}${category.image.url}`) : null);
        setCurrentId(category._id);
        setIsEditing(true);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setIsEditing(false);
        setCurrentId(null);
        setFormData({ title: '', description: '', order: 0, isActive: true });
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const filteredCategories = categories.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Program Categories</h1>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Add Category
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map(item => (
                    <div key={item._id} className="bg-white rounded-xl shadow-sm border overflow-hidden group">
                        <div className="h-40 bg-gray-100 relative">
                            {item.image?.url ? (
                                <Image
                                    src={item.image.url.startsWith('http') ? item.image.url : `${API_URL.replace('/api', '')}${item.image.url}`}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditModal(item)} className="p-2 bg-white rounded-full shadow hover:text-blue-600"><Edit size={16} /></button>
                                <button onClick={() => handleDelete(item._id)} className="p-2 bg-white rounded-full shadow hover:text-red-600"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.description || 'No description'}</p>
                            <div className="flex justify-between items-center text-xs text-gray-400">
                                <span>Order: {item.order}</span>
                                <span className={`px-2 py-1 rounded-full ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {item.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">{isEditing ? 'Edit Category' : 'New Category'}</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Order</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded"
                                        value={formData.order}
                                        onChange={e => setFormData({ ...formData, order: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4"
                                            checked={formData.isActive}
                                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        <span>Active</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Cover Image</label>
                                <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 relative" onClick={() => document.getElementById('cat-image').click()}>
                                    {previewUrl ? (
                                        <div className="relative h-40 w-full">
                                            <Image src={previewUrl} alt="Preview" fill className="object-cover rounded" />
                                        </div>
                                    ) : (
                                        <div className="py-8 text-gray-500">
                                            <Upload className="mx-auto mb-2" />
                                            <span className="text-sm">Click to upload image</span>
                                        </div>
                                    )}
                                    <input id="cat-image" type="file" className="hidden" onChange={handleFileSelect} accept="image/*" />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {isSaving && <Loader2 className="animate-spin" size={18} />}
                                {isSaving ? 'Saving...' : 'Save Category'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
