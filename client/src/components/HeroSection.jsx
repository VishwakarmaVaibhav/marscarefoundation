'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCreative, Navigation } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import api from '@/lib/api';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';
import 'swiper/css/navigation';

export default function HeroSection() {
    const [slides, setSlides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const response = await api.get('/heroes');
                const data = response.data;
                if (data.success && data.data.length > 0) {
                    setSlides(data.data);
                } else {
                    setSlides([]);
                }
            } catch (error) {
                console.error('Error fetching hero slides', error);
                setSlides([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSlides();
    }, []);

    if (isLoading) {
        return <div className="h-screen bg-neutral-900 animate-pulse"></div>;
    }

    if (slides.length === 0) {
        return null; // Don't render if no slides
    }

    const getMediaUrl = (slide) => {
        return (isMobile && slide.mobileMediaUrl) ? slide.mobileMediaUrl : slide.mediaUrl;
    };

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            <Swiper
                modules={[Autoplay, Pagination, EffectCreative, Navigation]}
                effect="creative"
                creativeEffect={{
                    prev: {
                        shadow: true,
                        translate: ['-20%', 0, -1],
                    },
                    next: {
                        translate: ['100%', 0, 0],
                    },
                }}
                speed={1000}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    renderBullet: function (index, className) {
                        return '<span class="' + className + ' w-3 h-3 bg-white/50 hover:bg-white !opacity-100 transition-all duration-300"></span>';
                    },
                }}
                navigation={false}
                loop={true}
                className="h-full w-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide._id} className="relative h-full w-full">
                        {/* Background Media */}
                        <div className="absolute inset-0 z-0">
                            {slide.type === 'video' ? (
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    key={getMediaUrl(slide)}
                                    className="h-full w-full object-cover"
                                >
                                    <source src={getMediaUrl(slide)} type="video/mp4" />
                                </video>
                            ) : (
                                <div
                                    className="h-full w-full bg-cover bg-center transform scale-105 animate-slow-zoom"
                                    style={{
                                        backgroundImage: `url(${getMediaUrl(slide)})`
                                    }}
                                />
                            )}
                            {/* Sophisticated Atmospheric Overlay - Less "Dark", More "Depth" */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-1" />
                            <div className="absolute inset-0 bg-primary/5 mix-blend-overlay z-1" />
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute inset-0 z-10 flex flex-col justify-center md:items-start items-center text-center md:text-left container-custom">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={slide._id}
                                    initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 50 : 0 }}
                                    animate={{ opacity: 1, x: 0, y: 0 }}
                                    exit={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? -30 : 0 }}
                                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative max-w-3xl pointer-events-none"
                                >
                                    {/* Glassmorphic Container for Text */}
                                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden pointer-events-auto
                                        max-h-[35vh] md:max-h-none overflow-y-auto no-scrollbar
                                        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">

                                        {/* Micro-interaction: Decorative line */}
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: 64 }}
                                            transition={{ delay: 0.5, duration: 1 }}
                                            className="h-[2px] bg-secondary mb-6 hidden md:block"
                                        />

                                        {slide.title && (
                                            <motion.h1
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3, duration: 0.8 }}
                                                className="font-playfair text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight italic tracking-tight"
                                            >
                                                {slide.title}
                                            </motion.h1>
                                        )}

                                        {slide.subtitle && (
                                            <motion.p
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5, duration: 0.8 }}
                                                className="text-base md:text-xl text-white/80 mb-8 max-w-xl leading-relaxed font-outfit font-light"
                                            >
                                                {slide.subtitle}
                                            </motion.p>
                                        )}

                                        {/* Buttons - Staggered Reveal */}
                                        {slide.buttons && slide.buttons.length > 0 && (
                                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                                {slide.buttons.map((btn, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.7 + (index * 0.1), duration: 0.5 }}
                                                    >
                                                        <Link
                                                            href={btn.link || '#'}
                                                            className={`group flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-500 transform hover:-translate-y-1 ${btn.variant === 'primary'
                                                                ? 'bg-secondary text-white hover:bg-white hover:text-primary shadow-xl shadow-secondary/20'
                                                                : btn.variant === 'secondary'
                                                                    ? 'bg-white text-primary hover:bg-secondary hover:text-white shadow-xl'
                                                                    : 'border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm'
                                                                }`}
                                                        >
                                                            {btn.label}
                                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Whole Slide Clickable Link Overlay */}
                            {slide.clickAction === 'card' && slide.link && (
                                <Link
                                    href={slide.link}
                                    className="absolute inset-0 z-0"
                                    aria-label={`Go to ${slide.title || 'link'}`}
                                />
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
            >
                <span className="text-xs uppercase tracking-[0.2em] text-white/50">Scroll</span>
                <div className="h-12 w-[1px] bg-gradient-to-b from-white to-transparent"></div>
            </motion.div>
        </section>
    );
}
