'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Users, GraduationCap, Stethoscope, ArrowRight } from 'lucide-react';
import ImpactCounter from '@/components/ImpactCounter';
import ProgramCard from '@/components/ProgramCard';
import ImpactStats from '@/components/ImpactStats';
import DonationWidget from '@/components/DonationWidget';
import HeroSection from '@/components/HeroSection';
import BlogSection from '@/components/BlogSection';
import { programsApi } from '@/lib/api';

const impactStats = [
    { icon: Users, value: 50000, label: 'Lives Impacted', suffix: '+' },
    { icon: GraduationCap, value: 5000, label: 'Children Educated', suffix: '+' },
    { icon: Stethoscope, value: 25000, label: 'Medical Treatments', suffix: '+' },
    { icon: Heart, value: 100, label: 'Villages Reached', suffix: '+' },
];

export default function HomePage() {
    const [featuredPrograms, setFeaturedPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            // Fetch all programs to ensure we have content to show
            const res = await programsApi.getAll({ limit: 3 });
            if (res.data.data && res.data.data.length > 0) {
                setFeaturedPrograms(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch programs', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Hero Section */}
            <HeroSection />

            {/* Quick Donate Widget */}
            <section className="relative z-30 -mt-20 px-4">
                <div className="container-custom">
                    <DonationWidget />
                </div>
            </section>

            <ImpactStats />

            {/* Featured Programs */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
                    >
                        <div>
                            <span className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Our Missions</span>
                            <h2 className="font-playfair text-4xl md:text-6xl font-bold text-primary italic">
                                Strategic Impact
                            </h2>
                        </div>
                        <Link href="/programs" className="btn-secondary inline-flex items-center gap-2 w-fit text-sm">
                            View All Programs
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            // Loading skeleton
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="glass-card h-[450px] animate-pulse">
                                    <div className="h-56 bg-gray-200/20" />
                                    <div className="p-6 space-y-4">
                                        <div className="h-6 bg-gray-200/20 rounded w-3/4" />
                                        <div className="h-4 bg-gray-200/20 rounded w-full" />
                                        <div className="h-4 bg-gray-200/20 rounded w-2/3" />
                                    </div>
                                </div>
                            ))
                        ) : featuredPrograms.length > 0 ? (
                            featuredPrograms.map((program, index) => (
                                <ProgramCard key={program.slug || program._id} program={program} index={index} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                <p>No featured programs at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="bg-primary rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

                        <div className="relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-8 italic">
                                    Ready to make a <br />human difference?
                                </h2>
                                <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12 font-outfit font-light leading-relaxed">
                                    Your contribution today can change a life forever. Join our community of radical kindness and sustainable impact.
                                </p>
                                <div className="flex flex-wrap justify-center gap-6">
                                    <Link href="/donate" className="px-12 py-5 bg-secondary text-white font-bold text-lg rounded-2xl hover:bg-white hover:text-primary transition-all shadow-2xl flex items-center gap-3 group">
                                        <Heart className="w-5 h-5 group-hover:scale-120 transition-transform" />
                                        Launch Donation
                                    </Link>
                                    <Link href="/volunteer" className="px-12 py-5 bg-white/5 backdrop-blur-xl border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all">
                                        Join as Volunteer
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <BlogSection />
        </>
    );
}
