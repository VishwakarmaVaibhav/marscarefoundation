'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function PageHero({ title, description, image = '/images/hero-bg.jpg', mobileImage, height = 'h-[50vh]' }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const heroImage = (isMobile && mobileImage) ? mobileImage : image;

    return (
        <section className={`relative w-full ${height} flex items-center justify-center overflow-hidden`}>
            {/* Background Image */}
            <div className="absolute inset-0 z-0 bg-primary">
                {heroImage && (
                    <Image
                        key={heroImage}
                        src={heroImage}
                        alt={title}
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
            </div>

            {/* Content */}
            <div className="container-custom relative z-10 text-center text-white px-4">
                <div className="inline-block bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="font-playfair text-4xl md:text-6xl font-bold mb-6 italic tracking-tight"
                    >
                        {title}
                    </motion.h1>
                    {description && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-outfit font-light leading-relaxed"
                        >
                            {description}
                        </motion.p>
                    )}
                </div>
            </div>
        </section>
    );
}
