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


        </section>
    );
}
