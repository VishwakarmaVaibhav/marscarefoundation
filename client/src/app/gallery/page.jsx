'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, ExternalLink, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { galleryApi } from '@/lib/api';
import PageHero from '@/components/PageHero';

export default function GalleryPage() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [categories, setCategories] = useState([]);

    // Lightbox State
    const [selectedIndex, setSelectedIndex] = useState(null);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const res = await galleryApi.getAll();
            setImages(res.data.data);
            const uniqueCategories = [...new Set(res.data.data.map(img => img.category))];
            setCategories(uniqueCategories);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch gallery', error);
            setLoading(false);
        }
    };

    const filteredImages = filter === 'all'
        ? images
        : images.filter(img => img.category === filter);

    const openLightbox = (index) => setSelectedIndex(index);
    const closeLightbox = () => setSelectedIndex(null);

    const nextImage = useCallback(() => {
        setSelectedIndex((prev) => (prev + 1) % filteredImages.length);
    }, [filteredImages.length]);

    const prevImage = useCallback(() => {
        setSelectedIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
    }, [filteredImages.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedIndex === null) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, nextImage, prevImage]);

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <PageHero
                image="https://images.unsplash.com/photo-1541976844346-a18bf90d2e13?q=80&w=2662&auto=format&fit=crop"
                mobileImage="https://images.unsplash.com/photo-1542810634-7bc2c7ad3100?q=80&w=774&auto=format&fit=crop"
            />

            <div className="container-custom py-24">
                {/* Creative Filter Bar */}
                <div className="flex flex-col items-center mb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-8 h-[1px] bg-secondary" />
                        <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">Visual Journeys</span>
                    </div>
                    <h2 className="font-playfair text-5xl font-bold text-primary mb-12">The Impact Gallery</h2>

                    <div className="flex flex-wrap justify-center gap-4 p-2 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-gray-100 shadow-xl shadow-primary/5">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-500 ${filter === 'all'
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'text-gray-400 hover:text-primary hover:bg-primary/5'
                                }`}
                        >
                            All Stories
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-500 capitalize ${filter === cat
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'text-gray-400 hover:text-primary hover:bg-primary/5'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Masonry Grid with Artistic Refinements */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10">
                    {filteredImages.map((image, index) => (
                        <motion.div
                            key={image._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                            onClick={() => openLightbox(index)}
                        >
                            <div className="relative overflow-hidden aspect-auto min-h-[300px]">
                                <Image
                                    src={image.imageUrl || '/placeholder-gallery.jpg'}
                                    alt={image.title}
                                    width={800}
                                    height={1000}
                                    className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                {/* Artistic Border Overlay */}
                                <div className="absolute inset-4 border border-white/20 rounded-[1.8rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                {/* Overlay Content */}
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-10">
                                    <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                        <p className="text-secondary text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                                            {image.category}
                                        </p>
                                        <h3 className="font-playfair text-2xl text-white font-bold leading-tight">
                                            {image.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredImages.length === 0 && !loading && (
                    <div className="text-center py-32 opacity-50">
                        <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg text-gray-500 font-serif">No images found in this category.</p>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center backdrop-blur-md"
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 z-50"
                        >
                            <X size={32} />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white transition-colors z-50 hidden md:block"
                        >
                            <ChevronLeft size={48} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white transition-colors z-50 hidden md:block"
                        >
                            <ChevronRight size={48} />
                        </button>

                        {/* Main Image */}
                        <div className="relative w-full h-full max-w-7xl max-h-[85vh] flex items-center justify-center p-4">
                            <motion.div
                                key={selectedIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="relative w-full h-full flex items-center justify-center"
                            >
                                <Image
                                    src={filteredImages[selectedIndex].imageUrl}
                                    alt={filteredImages[selectedIndex].title}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </motion.div>
                        </div>

                        {/* Bottom Details Panel */}
                        <motion.div
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-8 px-6 md:px-12"
                        >
                            <div className="max-w-4xl mx-auto text-white">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-[1px] bg-secondary" />
                                            <p className="text-secondary text-[10px] font-bold tracking-widest uppercase">{filteredImages[selectedIndex].category}</p>
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-bold font-playfair">{filteredImages[selectedIndex].title}</h2>
                                        {filteredImages[selectedIndex].description && (
                                            <p className="text-white/70 text-sm max-w-2xl leading-relaxed">
                                                {filteredImages[selectedIndex].description}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-white/50 uppercase tracking-wider font-medium">
                                            {filteredImages[selectedIndex].eventDate && (
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={14} />
                                                    {new Date(filteredImages[selectedIndex].eventDate).toLocaleDateString(undefined, {
                                                        year: 'numeric', month: 'long', day: 'numeric'
                                                    })}
                                                </span>
                                            )}
                                            {filteredImages[selectedIndex].location && (
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin size={14} />
                                                    {filteredImages[selectedIndex].location}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Program Link */}
                                    {filteredImages[selectedIndex].program && (
                                        <div className="flex-shrink-0">
                                            <p className="text-xs text-white/40 mb-1 uppercase tracking-widest font-semibold">From Program</p>
                                            <Link
                                                href={`/programs/${filteredImages[selectedIndex].program.slug}`}
                                                className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-5 py-3 rounded-lg border border-white/10 transition-all hover:border-white/30"
                                            >
                                                <div className="text-left">
                                                    <span className="block font-bold text-sm group-hover:text-blue-200 transition-colors">
                                                        {filteredImages[selectedIndex].program.title}
                                                    </span>
                                                </div>
                                                <ExternalLink size={18} className="text-white/70 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
