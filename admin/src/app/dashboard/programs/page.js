'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, Upload, X, Star, CheckCircle, HelpCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { programsApi, api } from '@/lib/api';
import { toast } from 'sonner';

import ConfirmModal from '@/components/ConfirmModal';
import Loader from '@/components/Loader';

export default function ProgramsManager() {
    const [programs, setPrograms] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Inline Category Creation State
    const [catModalOpen, setCatModalOpen] = useState(false);
    const [newCatTitle, setNewCatTitle] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        targetAmount: '',
        category: '',
        active: true,
        isFeatured: false,
        order: 0,
        features: [],
        testimonials: []
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [mobileFile, setMobileFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]); // New state for multiple files
    const [existingGallery, setExistingGallery] = useState([]); // State to show existing gallery images

    const [previewUrl, setPreviewUrl] = useState('');
    const [mobilePreviewUrl, setMobilePreviewUrl] = useState('');
    const [galleryPreviews, setGalleryPreviews] = useState([]); // Previews for new gallery uploads
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        // Fetch Programs
        try {
            const programsRes = await programsApi.getAll();
            setPrograms(programsRes.data.data);
        } catch (error) {
            console.error('Failed to fetch programs', error);
            toast.error('Failed to fetch programs');
        }

        // Fetch Categories (independent)
        try {
            const categoriesRes = await api.get('/program-categories/admin');
            setCategories(categoriesRes.data.data);
        } catch (error) {
            console.error('Quick fix: ignoring category fetch error', error);
        }

        setLoading(false);
    };

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            await programsApi.delete(itemToDelete);
            toast.success('Program deleted successfully');
            setPrograms(programs.filter(p => p._id !== itemToDelete));
            setDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            toast.error('Failed to delete program');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleMobileFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMobileFile(file);
            setMobilePreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleGallerySelect = (e) => {
        const files = Array.from(e.target.files);
        setGalleryFiles(prev => [...prev, ...files]);

        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name
        }));
        setGalleryPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeGalleryType = (index, type) => {
        // type: 'new' or 'existing'
        if (type === 'new') {
            setGalleryFiles(prev => prev.filter((_, i) => i !== index));
            setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
        } else {
            // For existing images, we might need a separate API call to delete specific image or handle in update
            // Simple version: Filter from UI local state, proper backend handling usually simpler if we just replace or handle deletion separate.
            // For this iteration, visual removal from UI list only (doesn't delete from DB until save if logic implemented, or separate delete endpoint).
            // Since implementation plan didn't specify complex gallery editing, we'll just omit from view or handle simplistic removal logic if backend supports it.
            // Our current backend creates new images, but doesn't explicitly delete single gallery images via updateProgram yet (update usually replaces or adds).
            // We'll hide them from UI for now.
            setExistingGallery(prev => prev.filter((_, i) => i !== index));
        }
    };


    const cleanUpModal = () => {
        setModalOpen(false);
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            title: '', description: '', targetAmount: '', category: '', active: true, isFeatured: false, order: 0,
            features: [], testimonials: []
        });
        setSelectedFile(null);
        setMobileFile(null);
        setGalleryFiles([]);
        setPreviewUrl('');
        setMobilePreviewUrl('');
        setGalleryPreviews([]);
        setExistingGallery([]);
    };

    const handleEdit = (program) => {
        setCurrentId(program._id);
        const categoryId = typeof program.category === 'object' ? program.category?._id : program.category;

        setFormData({
            title: program.title,
            description: program.description,
            targetAmount: program.targetAmount,
            category: categoryId || '',
            active: program.status === 'active',
            isFeatured: program.isFeatured,
            order: program.order || 0,
            features: program.features || [],
            testimonials: program.testimonials || []
        });
        setPreviewUrl(program.featuredImage?.url || '');
        setMobilePreviewUrl(program.featuredImage?.mobileUrl || '');
        setExistingGallery(program.gallery || []);
        setIsEditing(true);
        setModalOpen(true);
    };

    const handleCreateCategory = async () => {
        if (!newCatTitle.trim()) return;
        try {
            const res = await api.post('/program-categories', { title: newCatTitle });
            setCategories([...categories, res.data.data]);
            setFormData(prev => ({ ...prev, category: res.data.data._id }));
            setCatModalOpen(false);
            setNewCatTitle('');
            toast.success('Category created');
        } catch (error) {
            toast.error('Failed to create category');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('targetAmount', formData.targetAmount);
        data.append('category', formData.category);
        data.append('status', formData.active ? 'active' : 'paused');
        data.append('isFeatured', formData.isFeatured);
        data.append('order', formData.order);

        data.append('features', JSON.stringify(formData.features));
        data.append('testimonials', JSON.stringify(formData.testimonials));

        if (selectedFile) {
            data.append('featuredImage', selectedFile);
        }

        if (mobileFile) {
            data.append('mobileImage', mobileFile);
        }

        // Append multiple gallery files
        galleryFiles.forEach(file => {
            data.append('gallery', file);
        });

        try {
            if (isEditing) {
                await programsApi.update(currentId, data);
                toast.success('Program updated successfully');
            } else {
                await programsApi.create(data);
                toast.success('Program created successfully');
            }
            fetchData();
            cleanUpModal();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Operation failed');
        } finally {
            setIsSaving(false);
        }
    };

    // --- Feature & Testimonial Helpers (Same as before) ---
    const addFeature = () => setFormData(prev => ({ ...prev, features: [...prev.features, { title: '', description: '', icon: 'star' }] }));
    const removeFeature = (idx) => setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
    const updateFeature = (idx, field, val) => {
        const newFeatures = [...formData.features];
        newFeatures[idx][field] = val;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addTestimonial = () => setFormData(prev => ({ ...prev, testimonials: [...prev.testimonials, { name: '', role: '', message: '' }] }));
    const removeTestimonial = (idx) => setFormData(prev => ({ ...prev, testimonials: prev.testimonials.filter((_, i) => i !== idx) }));
    const updateTestimonial = (idx, field, val) => {
        const newTestimonials = [...formData.testimonials];
        newTestimonials[idx][field] = val;
        setFormData(prev => ({ ...prev, testimonials: newTestimonials }));
    };

    const filteredPrograms = programs.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader />;

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#1A3C5A]">Programs</h1>
                    <p className="text-gray-500 mt-1">Manage your initiatives and impact stories</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search programs..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A3C5A] outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-[#1A3C5A] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#132c42] transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <Plus size={20} />
                        Add Program
                    </button>
                </div>
            </div>

            {/* List (Same as before) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.map(item => (
                    <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                        <div className="relative h-48 bg-gray-100">
                            {item.featuredImage?.url ? (
                                <Image
                                    src={item.featuredImage.url}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                            )}
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(item)} className="p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:text-blue-600 transition-colors">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => confirmDelete(item._id)} className="p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="absolute bottom-3 left-3">
                                <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold text-[#1A3C5A] capitalize">
                                    {typeof item.category === 'object' && item.category ? item.category.title : 'Initiative'}
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-lg text-[#1A3C5A] mb-2 line-clamp-1">{item.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{item.description}</p>

                            <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-3">
                                <span className={`flex items-center gap-1 ${item.status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>
                                    <div className={`w-2 h-2 rounded-full ${item.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                    {item.status === 'active' ? 'Active' : 'Paused'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-2xl font-bold text-[#1A3C5A]">{isEditing ? 'Edit Program' : 'New Program'}</h2>
                            <button onClick={cleanUpModal} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
                            {/* Basic Info Section */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                                    <CheckCircle size={18} className="text-blue-500" /> Basic Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Program Title</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="e.g. Clean Water Initiative"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <div className="flex gap-2">
                                            <select
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="">Select Category (Optional)</option>
                                                {categories.map(cat => (
                                                    <option key={cat._id} value={cat._id}>{cat.title}</option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => setCatModalOpen(true)}
                                                className="bg-blue-100 text-blue-600 px-3 rounded-lg hover:bg-blue-200"
                                                title="Create New Category"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg outline-none"
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Detailed description..."
                                    required
                                />
                            </section>

                            {/* Gallery Section */}
                            <section className="space-y-4">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <ImageIcon size={18} className="text-purple-500" /> Program Gallery
                                    </h3>
                                    <label className="text-xs text-blue-600 font-bold uppercase tracking-wider hover:text-blue-800 cursor-pointer flex items-center gap-1">
                                        <Plus size={14} /> Add Images
                                        <input type="file" multiple accept="image/*" onChange={handleGallerySelect} className="hidden" />
                                    </label>
                                </div>

                                {/* Existing Gallery */}
                                {existingGallery.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-xs font-semibold text-gray-500 mb-2">Existing Images</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {existingGallery.map((img, idx) => (
                                                <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                                                    <Image src={img.url} alt="" fill className="object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Uploads Preview */}
                                {galleryPreviews.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-500 mb-2">New Uploads</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {galleryPreviews.map((preview, idx) => (
                                                <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border group">
                                                    <Image src={preview.url} alt="" fill className="object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryType(idx, 'new')}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Features Section */}
                            <section className="space-y-4">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <Star size={18} className="text-amber-500" /> Features
                                    </h3>
                                    <button type="button" onClick={addFeature} className="text-xs text-blue-600 font-bold uppercase tracking-wider">+ Add</button>
                                </div>
                                <div className="grid gap-4">
                                    {formData.features.map((feat, idx) => (
                                        <div key={idx} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl relative">
                                            <div className="flex-1 space-y-3">
                                                <input placeholder="Feature Title" value={feat.title} onChange={(e) => updateFeature(idx, 'title', e.target.value)} className="w-full p-2 text-sm border rounded" />
                                                <input placeholder="Description" value={feat.description} onChange={(e) => updateFeature(idx, 'description', e.target.value)} className="w-full p-2 text-sm border rounded" />
                                            </div>
                                            <button type="button" onClick={() => removeFeature(idx)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Testimonials Section */}
                            <section className="space-y-4">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <HelpCircle size={18} className="text-green-500" /> Testimonials
                                    </h3>
                                    <button type="button" onClick={addTestimonial} className="text-xs text-blue-600 font-bold uppercase tracking-wider">+ Add</button>
                                </div>
                                <div className="grid gap-4">
                                    {formData.testimonials.map((test, idx) => (
                                        <div key={idx} className="bg-gray-50 p-4 rounded-xl relative">
                                            <div className="grid md:grid-cols-2 gap-3 mb-3">
                                                <input placeholder="Name" value={test.name} onChange={(e) => updateTestimonial(idx, 'name', e.target.value)} className="w-full p-2 text-sm border rounded" />
                                                <input placeholder="Role" value={test.role} onChange={(e) => updateTestimonial(idx, 'role', e.target.value)} className="w-full p-2 text-sm border rounded" />
                                            </div>
                                            <textarea placeholder="Message" value={test.message} onChange={(e) => updateTestimonial(idx, 'message', e.target.value)} className="w-full p-2 text-sm border rounded" rows="2" />
                                            <button type="button" onClick={() => removeTestimonial(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Other Details */}
                            <section className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (₹)</label>
                                    <input type="number" className="w-full p-2.5 border rounded-lg" value={formData.targetAmount} onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })} />
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium text-gray-700">Featured Images</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Desktop Image */}
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">Desktop Version</p>
                                            <div className="border border-dashed rounded-lg p-2 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 bg-white min-h-[100px]" onClick={() => document.getElementById('prog-image').click()}>
                                                <div className="w-full h-16 bg-gray-100 rounded-lg overflow-hidden relative">
                                                    {previewUrl ? <Image src={previewUrl} alt="Prev" fill className="object-cover" /> : <div className="flex items-center justify-center h-full"><Upload size={14} className="text-gray-400" /></div>}
                                                </div>
                                                <div className="text-[10px] text-gray-500 font-semibold text-center text-blue-600">Upload Desktop</div>
                                            </div>
                                            <input id="prog-image" type="file" className="hidden" onChange={handleFileSelect} accept="image/*" />
                                        </div>

                                        {/* Mobile Image */}
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">Mobile Version</p>
                                            <div className="border border-dashed rounded-lg p-2 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 bg-white min-h-[100px]" onClick={() => document.getElementById('prog-mobile-image').click()}>
                                                <div className="w-full h-16 bg-gray-100 rounded-lg overflow-hidden relative">
                                                    {mobilePreviewUrl ? <Image src={mobilePreviewUrl} alt="Prev" fill className="object-cover" /> : <div className="flex items-center justify-center h-full"><Upload size={14} className="text-gray-400" /></div>}
                                                </div>
                                                <div className="text-[10px] text-gray-500 font-semibold text-center text-blue-600">Upload Mobile</div>
                                            </div>
                                            <input id="prog-mobile-image" type="file" className="hidden" onChange={handleMobileFileSelect} accept="image/*" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="flex justify-end gap-3 pt-6 border-t">
                                <button type="button" onClick={cleanUpModal} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
                                <button type="submit" disabled={isSaving} className="px-8 py-2.5 bg-[#1A3C5A] text-white rounded-lg hover:bg-[#132c42] font-medium flex items-center gap-2 shadow-lg shadow-blue-900/20">
                                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                    {isSaving ? 'Saving...' : 'Save Program'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Quick Category Modal */}
            {catModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl">
                        <h3 className="text-lg font-bold mb-4">New Category</h3>
                        <input
                            autoFocus
                            value={newCatTitle}
                            onChange={(e) => setNewCatTitle(e.target.value)}
                            placeholder="Category Name"
                            className="w-full p-2 border rounded mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setCatModalOpen(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                            <button onClick={handleCreateCategory} className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal - Only for Programs */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Program"
                message="Are you sure you want to delete this program? This action cannot be undone."
            />
        </div>
    );
}
