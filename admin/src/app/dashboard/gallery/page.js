'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Search, Upload, X, Loader2, Download } from 'lucide-react';
import Image from 'next/image';
import { galleryApi, programsApi, api } from '@/lib/api';
import { toast } from 'sonner';

import ConfirmModal from '@/components/ConfirmModal';
import Loader from '@/components/Loader';

export default function GalleryManager() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Deletion State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Upload State
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'other',
        eventDate: new Date().toISOString().split('T')[0]
    });

    // Import State
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [programs, setPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState('');
    const [programImages, setProgramImages] = useState([]);
    const [selectedImportImages, setSelectedImportImages] = useState([]);
    const [isImporting, setIsImporting] = useState(false);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const res = await galleryApi.getAll();
            setImages(res.data.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch gallery');
            setLoading(false);
        }
    };

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            await galleryApi.delete(itemToDelete);
            toast.success('Image deleted successfully');
            setImages(images.filter(img => img._id !== itemToDelete));
            setDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            toast.error('Failed to delete image');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const cleanUpUpload = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setFormData({ title: '', description: '', category: 'other', eventDate: new Date().toISOString().split('T')[0] });
        setUploadModalOpen(false);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setIsUploading(true);
        const data = new FormData();
        data.append('images', selectedFile);
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('eventDate', formData.eventDate);

        try {
            await galleryApi.upload(data);
            toast.success('Image uploaded successfully');
            fetchGallery();
            cleanUpUpload();
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    // --- Import Logic ---
    const openImportModal = async () => {
        setImportModalOpen(true);
        try {
            const res = await programsApi.getAll();
            setPrograms(res.data.data);
        } catch (error) {
            toast.error('Failed to fetch programs');
        }
    };

    const handleProgramSelect = async (e) => {
        const programId = e.target.value;
        setSelectedProgram(programId);
        setSelectedImportImages([]);

        if (!programId) {
            setProgramImages([]);
            return;
        }

        const program = programs.find(p => p._id === programId);
        if (program) {
            // Combine featured image and gallery
            const images = [];
            if (program.featuredImage?.url) {
                images.push({ ...program.featuredImage, type: 'featured' });
            }
            if (program.gallery?.length > 0) {
                images.push(...program.gallery.map(img => ({ ...img, type: 'gallery' })));
            }
            setProgramImages(images);
        }
    };

    const toggleImportSelection = (imgUrl) => {
        if (selectedImportImages.includes(imgUrl)) {
            setSelectedImportImages(prev => prev.filter(url => url !== imgUrl));
        } else {
            setSelectedImportImages(prev => [...prev, imgUrl]);
        }
    };

    const handleImportSubmit = async () => {
        if (!selectedProgram || selectedImportImages.length === 0) return;
        setIsImporting(true);

        try {
            const imagesToImport = programImages
                .filter(img => selectedImportImages.includes(img.url))
                .map(img => ({
                    url: img.url,
                    publicId: img.publicId,
                    alt: img.alt
                }));

            await api.post('/gallery/import-program', {
                programId: selectedProgram,
                images: imagesToImport
            });

            toast.success('Images imported successfully');
            fetchGallery();
            setImportModalOpen(false);
            setSelectedProgram('');
            setProgramImages([]);
            setSelectedImportImages([]);
        } catch (error) {
            console.error(error);
            toast.error('Failed to import images');
        } finally {
            setIsImporting(false);
        }
    };


    const filteredImages = images.filter(img =>
        img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader />;

    return (
        <div className="space-y-6 p-6">
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Photo"
                message="Are you sure you want to delete this photo?"
                isDangerous={true}
            />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gallery Manager</h1>
                    <p className="text-gray-500">Manage your photo gallery and albums</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={openImportModal}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Import from Program
                    </button>
                    <button
                        onClick={() => setUploadModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Upload Photo
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredImages.map((image) => (
                    <div key={image._id} className="group relative bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="aspect-square relative">
                            <Image
                                src={image.imageUrl}
                                alt={image.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => confirmDelete(image._id)}
                                    className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            {image.program && (
                                <div className="absolute top-1 right-1">
                                    <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">Program</span>
                                </div>
                            )}
                        </div>
                        <div className="p-2">
                            <h3 className="text-sm font-medium truncate text-gray-800">{image.title}</h3>
                            <p className="text-xs text-gray-500 capitalize">{image.category}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upload Modal */}
            {uploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Upload New Photo</h2>
                            <button onClick={cleanUpUpload}><X className="w-6 h-6 text-gray-400" /></button>
                        </div>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 relative" onClick={() => document.getElementById('upload-input').click()}>
                                {previewUrl ? (
                                    <div className="relative h-48 w-full"><Image src={previewUrl} alt="Prev" fill className="object-contain" /></div>
                                ) : (
                                    <div className="py-4">
                                        <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">Click to upload</p>
                                    </div>
                                )}
                                <input id="upload-input" type="file" onChange={handleFileSelect} accept="image/*" className="hidden" />
                            </div>

                            <input
                                placeholder="Image Title"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-2 border rounded"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="events">Events</option>
                                    <option value="programs">Programs</option>
                                    <option value="team">Team</option>
                                    <option value="impact">Impact</option>
                                    <option value="volunteers">Volunteers</option>
                                    <option value="other">Other</option>
                                </select>
                                <input
                                    type="date"
                                    value={formData.eventDate}
                                    onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <button type="submit" disabled={isUploading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-blue-700">
                                {isUploading && <Loader2 className="animate-spin" size={18} />}
                                {isUploading ? 'Uploading...' : 'Upload Photo'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Import from Program Modal */}
            {importModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl p-6 relative shadow-xl h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Import from Program</h2>
                            <button onClick={() => setImportModalOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Select Program</label>
                                <select
                                    className="w-full p-2 border rounded-lg"
                                    value={selectedProgram}
                                    onChange={handleProgramSelect}
                                >
                                    <option value="">-- Choose a Program --</option>
                                    {programs.map(p => (
                                        <option key={p._id} value={p._id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedProgram && programImages.length > 0 && (
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                    {programImages.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => toggleImportSelection(img.url)}
                                            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedImportImages.includes(img.url) ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent'}`}
                                        >
                                            <Image src={img.url} alt="" fill className="object-cover" />
                                            {selectedImportImages.includes(img.url) && (
                                                <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                                                    <div className="bg-blue-600 text-white rounded-full p-1"><Upload size={16} /></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedProgram && programImages.length === 0 && (
                                <div className="text-center py-10 text-gray-500">
                                    This program has no images to import.
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t mt-4 flex justify-end gap-3">
                            <button onClick={() => setImportModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                            <button
                                onClick={handleImportSubmit}
                                disabled={selectedImportImages.length === 0 || isImporting}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isImporting && <Loader2 className="animate-spin" size={18} />}
                                Import {selectedImportImages.length} Images
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
