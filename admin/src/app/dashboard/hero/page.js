'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon, Video, Upload, Monitor, Smartphone, Link as LinkIcon, MousePointer } from 'lucide-react';
import api from '@/lib/api';
import Image from 'next/image';

export default function HeroManager() {
    const [heroes, setHeroes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentHero, setCurrentHero] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [programs, setPrograms] = useState([]);
    const [showProgramModal, setShowProgramModal] = useState(false);

    // Preview Mode State
    const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' or 'mobile'

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        type: 'image',
        order: 0,
        isActive: true,
        media: null,
        mobileMedia: null,
        link: '',
        clickAction: 'button', // 'button' or 'card'
        buttons: [
            { label: 'Donate Now', link: '/donate', variant: 'primary' },
            { label: 'Learn More', link: '/programs', variant: 'secondary' }
        ]
    });

    useEffect(() => {
        fetchHeroes();
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await api.get('/programs');
            setPrograms(response.data.data);
        } catch (error) {
            console.error('Error fetching programs:', error);
        }
    };

    const fetchHeroes = async () => {
        try {
            const response = await api.get('/heroes/admin');
            setHeroes(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching heroes:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleButtonChange = (index, field, value) => {
        const newButtons = [...formData.buttons];
        newButtons[index][field] = value;
        setFormData(prev => ({ ...prev, buttons: newButtons }));
    };

    const addButton = () => {
        setFormData(prev => ({
            ...prev,
            buttons: [...prev.buttons, { label: 'New Button', link: '/', variant: 'secondary' }]
        }));
    };

    const removeButton = (index) => {
        setFormData(prev => ({
            ...prev,
            buttons: prev.buttons.filter((_, i) => i !== index)
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, media: file }));
            if (previewMode === 'desktop') {
                setPreviewUrl(URL.createObjectURL(file));
            }
        }
    };

    const handleMobileFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, mobileMedia: file }));
            if (previewMode === 'mobile') {
                setPreviewUrl(URL.createObjectURL(file));
            }
        }
    };

    const handleProgramImport = (program) => {
        setFormData(prev => ({
            ...prev,
            title: program.title,
            subtitle: program.shortDescription || program.title,
            type: 'image',
            link: `/programs/${program.slug}`,
            clickAction: 'card',
            buttons: [{ label: 'View Program', link: `/programs/${program.slug}`, variant: 'primary' }],
            media: null
        }));

        if (program.featuredImage?.url) {
            setPreviewUrl(program.featuredImage.url);
        }
        setShowProgramModal(false);
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title || ''); // Optional
        data.append('subtitle', formData.subtitle || ''); // Optional
        data.append('type', formData.type);
        data.append('order', formData.order);
        data.append('isActive', formData.isActive);
        data.append('link', formData.link);
        data.append('clickAction', formData.clickAction);
        data.append('buttons', JSON.stringify(formData.buttons));

        if (formData.media) {
            data.append('media', formData.media);
        } else if (previewUrl && previewMode === 'desktop') {
            data.append('mediaUrl', previewUrl);
        }

        if (formData.mobileMedia) {
            data.append('mobileMedia', formData.mobileMedia);
        } else if (currentHero?.mobileMediaUrl) {
            data.append('mobileMediaUrl', currentHero.mobileMediaUrl);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            if (currentHero) {
                await api.put(`/heroes/${currentHero._id}`, data, config);
            } else {
                await api.post('/heroes', data, config);
            }

            fetchHeroes();
            resetForm();
        } catch (error) {
            console.error('Error saving hero:', error);
            alert('Failed to save hero slide');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            subtitle: '',
            type: 'image',
            order: 0,
            isActive: true,
            media: null,
            mobileMedia: null,
            link: '',
            clickAction: 'button',
            buttons: [
                { label: 'Donate Now', link: '/donate', variant: 'primary' },
                { label: 'Learn More', link: '/programs', variant: 'secondary' }
            ]
        });
        setPreviewUrl('');
        setIsEditing(false);
        setCurrentHero(null);
    };

    const startEdit = (hero) => {
        setCurrentHero(hero);
        setFormData({
            title: hero.title || '',
            subtitle: hero.subtitle || '',
            type: hero.type,
            order: hero.order,
            isActive: hero.isActive,
            media: null,
            mobileMedia: null,
            link: hero.link || '',
            clickAction: hero.clickAction || 'button',
            buttons: hero.buttons || []
        });
        setPreviewUrl(hero.mediaUrl);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this slide?')) return;
        try {
            await api.delete(`/heroes/${id}`);
            fetchHeroes();
        } catch (error) {
            console.error('Error deleting hero:', error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Hero Section Manager</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowProgramModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                    >
                        <Upload size={20} />
                        Import from Program
                    </button>
                    <button
                        onClick={() => { resetForm(); setIsEditing(true); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                    >
                        <Plus size={20} />
                        Add New Slide
                    </button>
                </div>
            </div>

            {/* List of Heroes */}
            {!isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {heroes.map((hero) => (
                        <div key={hero._id} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${!hero.isActive ? 'opacity-60' : ''}`}>
                            <div className="h-48 relative bg-gray-100">
                                {hero.type === 'video' ? (
                                    <video src={hero.mediaUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <Image
                                        src={hero.mediaUrl}
                                        alt={hero.title || 'Slide'}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button onClick={() => startEdit(hero)} className="p-2 bg-white/90 rounded-full hover:text-blue-600 transition-colors">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(hero._id)} className="p-2 bg-white/90 rounded-full hover:text-red-600 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-800 mb-1">{hero.title || '(No Title)'}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{hero.subtitle || '(No Subtitle)'}</p>
                                <div className="mt-4 flex items-center justify-between text-sm">
                                    <span className={`px-2 py-1 rounded-full ${hero.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {hero.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className="text-gray-400">Order: {hero.order}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit/Create Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl">

                        {/* Left: Form */}
                        <div className="w-full md:w-1/2 p-6 border-r border-gray-100 overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">{currentHero ? 'Edit Slide' : 'New Slide'}</h2>
                                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter heading..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (Optional)</label>
                                    <textarea
                                        name="subtitle"
                                        value={formData.subtitle}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                        placeholder="Enter description..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                        <input
                                            type="number"
                                            name="order"
                                            value={formData.order}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700 font-medium">Active Slide</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <MousePointer size={18} />
                                        Interaction Settings
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Click Action</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg flex-1 hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="clickAction"
                                                    value="button"
                                                    checked={formData.clickAction === 'button'}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4"
                                                />
                                                <div>
                                                    <span className="block font-medium">Buttons Only</span>
                                                    <span className="text-xs text-gray-500">Only buttons link to pages</span>
                                                </div>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg flex-1 hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="clickAction"
                                                    value="card"
                                                    checked={formData.clickAction === 'card'}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4"
                                                />
                                                <div>
                                                    <span className="block font-medium">Whole Slide</span>
                                                    <span className="text-xs text-gray-500">Entire background is clickable</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {formData.clickAction === 'card' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Slide Link URL</label>
                                            <div className="flex items-center gap-2">
                                                <LinkIcon size={16} className="text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="link"
                                                    value={formData.link}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border rounded-lg"
                                                    placeholder="https://... or /contact"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold">Action Buttons</h3>
                                        <button type="button" onClick={addButton} className="text-sm text-blue-600 font-medium hover:text-blue-800">
                                            + Add Button
                                        </button>
                                    </div>

                                    {formData.buttons.map((btn, idx) => (
                                        <div key={idx} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg">
                                            <div className="grid grid-cols-3 gap-2 flex-grow">
                                                <input
                                                    placeholder="Label"
                                                    value={btn.label}
                                                    onChange={(e) => handleButtonChange(idx, 'label', e.target.value)}
                                                    className="p-2 border rounded text-sm"
                                                />
                                                <input
                                                    placeholder="Link"
                                                    value={btn.link}
                                                    onChange={(e) => handleButtonChange(idx, 'link', e.target.value)}
                                                    className="p-2 border rounded text-sm"
                                                />
                                                <select
                                                    value={btn.variant}
                                                    onChange={(e) => handleButtonChange(idx, 'variant', e.target.value)}
                                                    className="p-2 border rounded text-sm"
                                                >
                                                    <option value="primary">Primary (Orange)</option>
                                                    <option value="secondary">Secondary (White)</option>
                                                    <option value="outline">Outline</option>
                                                </select>
                                            </div>
                                            <button type="button" onClick={() => removeButton(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <h3 className="font-semibold">Background Media</h3>
                                    <div className="flex gap-4 mb-4">
                                        <label className={`flex gap-2 px-4 py-2 rounded-lg cursor-pointer ${formData.type === 'image' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-600'}`}>
                                            <input
                                                type="radio"
                                                name="type"
                                                value="image"
                                                checked={formData.type === 'image'}
                                                onChange={handleInputChange}
                                                className="hidden"
                                            />
                                            <ImageIcon size={20} /> Image
                                        </label>
                                        <label className={`flex gap-2 px-4 py-2 rounded-lg cursor-pointer ${formData.type === 'video' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-600'}`}>
                                            <input
                                                type="radio"
                                                name="type"
                                                value="video"
                                                checked={formData.type === 'video'}
                                                onChange={handleInputChange}
                                                className="hidden"
                                            />
                                            <Video size={20} /> Video
                                        </label>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Desktop Version</label>
                                            <input
                                                type="file"
                                                accept={formData.type === 'video' ? 'video/*' : 'image/*'}
                                                onChange={handleFileChange}
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Mobile Version (Optional)</label>
                                            <input
                                                type="file"
                                                accept={formData.type === 'video' ? 'video/*' : 'image/*'}
                                                onChange={handleMobileFileChange}
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </div>
                                    </div>

                                    {(formData.media || formData.mobileMedia || previewUrl || currentHero?.mobileMediaUrl) && (
                                        <div className="text-xs text-gray-500 mt-2">
                                            Media selected. Use the device toggles on the right to preview.
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2 pt-6">
                                    <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                                        <Save size={18} />
                                        {loading ? 'Saving...' : 'Save Slide'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right: Preview */}
                        <div className="w-full md:w-1/2 bg-gray-900 p-8 flex flex-col items-center justify-center relative min-h-[500px]">

                            {/* Device Toggles */}
                            <div className="bg-white/10 backdrop-blur-md rounded-full p-1 flex gap-1 mb-8 absolute top-6">
                                <button
                                    onClick={() => setPreviewMode('desktop')}
                                    className={`p-2 rounded-full transition-all ${previewMode === 'desktop' ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}
                                    title="Desktop View"
                                >
                                    <Monitor size={20} />
                                </button>
                                <button
                                    onClick={() => setPreviewMode('mobile')}
                                    className={`p-2 rounded-full transition-all ${previewMode === 'mobile' ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}
                                    title="Mobile View"
                                >
                                    <Smartphone size={20} />
                                </button>
                            </div>

                            {/* Live Preview Container */}
                            <div
                                className={`relative bg-black border-4 border-gray-800 shadow-2xl overflow-hidden transition-all duration-500 ease-in-out ${previewMode === 'mobile' ? 'w-[375px] h-[667px] rounded-[3rem]' : 'w-full h-[350px] rounded-xl'
                                    }`}
                            >
                                {/* Media Background */}
                                {(() => {
                                    let currentPreview = '';
                                    if (previewMode === 'mobile') {
                                        if (formData.mobileMedia) currentPreview = URL.createObjectURL(formData.mobileMedia);
                                        else if (currentHero?.mobileMediaUrl) currentPreview = currentHero.mobileMediaUrl;
                                        else if (formData.media) currentPreview = URL.createObjectURL(formData.media);
                                        else currentPreview = previewUrl;
                                    } else {
                                        if (formData.media) currentPreview = URL.createObjectURL(formData.media);
                                        else currentPreview = previewUrl;
                                    }

                                    if (!currentPreview) return (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-800">
                                            No Media Selected
                                        </div>
                                    );

                                    return (
                                        <>
                                            {formData.type === 'video' ? (
                                                <video src={currentPreview} className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
                                            ) : (
                                                <img src={currentPreview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                                            )}
                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-black/40" />
                                        </>
                                    );
                                })()}

                                {/* Content Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                                    <div className="max-w-2xl">
                                        {formData.title && (
                                            <h2 className={`font-bold text-white mb-4 leading-tight ${previewMode === 'mobile' ? 'text-3xl' : 'text-4xl'
                                                }`}>
                                                {formData.title}
                                            </h2>
                                        )}
                                        {formData.subtitle && (
                                            <p className={`text-white/90 mb-8 line-clamp-3 ${previewMode === 'mobile' ? 'text-sm' : 'text-lg'
                                                }`}>
                                                {formData.subtitle}
                                            </p>
                                        )}

                                        {formData.buttons && formData.buttons.length > 0 && (
                                            <div className={`flex flex-wrap justify-center gap-4 ${previewMode === 'mobile' ? 'flex-col' : ''}`}>
                                                {formData.buttons.map((btn, i) => (
                                                    <span
                                                        key={i}
                                                        className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${btn.variant === 'primary'
                                                            ? 'bg-[#FF6B35] text-white shadow-lg'
                                                            : btn.variant === 'secondary'
                                                                ? 'bg-white text-gray-900 shadow-lg'
                                                                : 'border-2 border-white text-white'
                                                            } ${previewMode === 'mobile' ? 'w-full' : ''}`}
                                                    >
                                                        {btn.label || 'Button'}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-500 text-xs mt-4">
                                Preview is approximate. Actual rendering may vary based on exact screen size.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Program Selection Modal */}
            {showProgramModal && (
                <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Select Program</h3>
                            <button onClick={() => setShowProgramModal(false)}><X size={20} /></button>
                        </div>
                        <div className="space-y-2">
                            {programs.map(program => (
                                <button
                                    key={program._id}
                                    onClick={() => handleProgramImport(program)}
                                    className="w-full p-3 text-left hover:bg-gray-50 rounded-lg border flex items-center gap-3"
                                >
                                    {program.featuredImage?.url && (
                                        <img src={program.featuredImage.url} alt="" className="w-10 h-10 rounded object-cover" />
                                    )}
                                    <span className="font-medium">{program.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
