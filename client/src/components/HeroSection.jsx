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

                        </div>

                        {/* Content Overlay */}
                        <div className="absolute inset-0 z-10 flex items-end justify-start p-28 md:p-24">
                            <AnimatePresence mode="wait">
                                {(slide.title || slide.subtitle || (slide.buttons && slide.buttons.length > 0)) && (
                                    <motion.div
                                        key={slide._id}
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                        className="max-w-md w-full"
                                    >
                                        <div className="
            bg-black/40 backdrop-blur-xl
            border border-white/10
            p-5 md:p-6
            rounded-2xl
            shadow-2xl
        ">

                                            {slide.title && (
                                                <h1 className="text-xl md:text-3xl font-semibold text-white mb-2 leading-tight">
                                                    {slide.title}
                                                </h1>
                                            )}

                                            {slide.subtitle && (
                                                <p className="text-sm md:text-base text-white/70 mb-4 leading-relaxed">
                                                    {slide.subtitle}
                                                </p>
                                            )}

                                            {slide.buttons && slide.buttons.length > 0 && (
                                                <div className="flex flex-wrap gap-3">
                                                    {slide.buttons.map((btn, index) => (
                                                        <Link
                                                            key={index}
                                                            href={btn.link || '#'}
                                                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300
                            ${btn.variant === 'primary'
                                                                    ? 'bg-secondary text-white hover:opacity-90'
                                                                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                                                                }`}
                                                        >
                                                            {btn.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}

                                        </div>
                                    </motion.div>
                                )}


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
            <motion.button
                onClick={() => {
                    window.scrollBy({
                        top: window.innerHeight * 0.8,
                        behavior: 'smooth'
                    });
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
            >
                <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                    Scroll
                </span>
                <div className="h-12 w-[1px] bg-gradient-to-b from-white to-transparent"></div>
            </motion.button>

        </section>
    );
}
