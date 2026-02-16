'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import PageHero from '@/components/PageHero';

export default function SuccessPage() {
    const { width, height } = useWindowSize();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />

            <PageHero
                image="/gallerydesk.jpg"
                mobileImage="/gallerymob.jpg"
                title="Thank You"
            />

            <div className="container-custom py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-10 border border-green-100 shadow-lg shadow-green-500/10">
                        <Check className="w-12 h-12 text-green-500" />
                    </div>

                    <h1 className="font-playfair text-5xl md:text-6xl font-bold text-primary mb-8">
                        Gratitude for Your Impact
                    </h1>

                    <p className="text-gray-500 text-xl font-outfit font-light mb-12 leading-relaxed">
                        Your contribution has been successfully received. You are now a vital part of the Mars Care legacy, helping us write stories of hope and transformation.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link
                            href="/"
                            className="px-12 py-5 bg-primary text-white font-bold text-sm rounded-[2rem] hover:bg-secondary transition-all shadow-xl hover:shadow-secondary/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            Return Home
                        </Link>
                        <Link
                            href="/gallery"
                            className="px-12 py-5 bg-white border border-gray-100 text-primary font-bold text-sm rounded-[2rem] hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2 group"
                        >
                            See Your Impact <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
