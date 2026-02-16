'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Target, Users, Heart, Filter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { programsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import PageHero from '@/components/PageHero';
import axios from 'axios';
import ProgramCard from '@/components/ProgramCard'; // Reusing the existing card component

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ProgramsPage() {
    const [programs, setPrograms] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [progRes, catRes] = await Promise.all([
                programsApi.getAll(),
                axios.get(`${API_URL}/program-categories`)
            ]);
            setPrograms(progRes.data.data);
            setCategories(catRes.data.data.sort((a, b) => a.order - b.order));
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch data', error);
            setLoading(false);
        }
    };

    // 1. Get unique active categories (only those that have programs)
    const activeCategories = useMemo(() => {
        const programCatIds = new Set(programs.map(p =>
            typeof p.category === 'object' ? p.category?._id : p.category
        ).filter(Boolean));

        return categories.filter(cat => programCatIds.has(cat._id));
    }, [programs, categories]);

    // 2. Filter programs based on selection
    const filteredPrograms = useMemo(() => {
        if (activeFilter === 'all') return programs;
        return programs.filter(p => {
            const pCatId = typeof p.category === 'object' ? p.category?._id : p.category;
            return pCatId === activeFilter;
        });
    }, [activeFilter, programs]);

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <PageHero
                image="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
                mobileImage="https://images.unsplash.com/photo-1542810634-7bc2c7ad3100?q=80&w=774&auto=format&fit=crop"
            />

            <section className="py-24 relative overflow-hidden bg-white">
                {/* Atmospheric Depth */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/[0.01] pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="container-custom relative z-10">
                    {/* Header & Filter Bar */}
                    <div className="flex flex-col items-center mb-20 text-center">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-[1px] bg-secondary" />
                            <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">Our Initiatives</span>
                        </div>
                        <h2 className="font-playfair text-5xl md:text-6xl font-bold text-primary mb-12">Active Missions</h2>

                        {/* Category Chips */}
                        <div className="flex flex-wrap justify-center gap-4 p-2 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-gray-100 shadow-xl shadow-primary/5">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-500 ${activeFilter === 'all'
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'text-gray-400 hover:text-primary hover:bg-primary/5'
                                    }`}
                            >
                                All Programs
                            </button>
                            {activeCategories.map((cat) => (
                                <button
                                    key={cat._id}
                                    onClick={() => setActiveFilter(cat._id)}
                                    className={`px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-500 capitalize ${activeFilter === cat._id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'text-gray-400 hover:text-primary hover:bg-primary/5'
                                        }`}
                                >
                                    {cat.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Check if we have any programs at all */}
                    {!loading && programs.length === 0 ? (
                        <div className="text-center py-20 opacity-50">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="font-playfair text-3xl font-bold text-gray-400">No active programs found</h3>
                            <p className="text-gray-400 mt-2 font-outfit">Please check back later for new initiatives.</p>
                        </div>
                    ) : (
                        <>
                            {/* Programs Grid */}
                            <motion.div
                                layout
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
                            >
                                <AnimatePresence mode='popLayout'>
                                    {filteredPrograms.map((program, index) => (
                                        <ProgramCard key={program._id} program={program} index={index} />
                                    ))}
                                </AnimatePresence>
                            </motion.div>

                            {/* Loading State */}
                            {loading && (
                                <div className="flex justify-center py-40">
                                    <div className="relative w-16 h-16">
                                        <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
                                        <div className="absolute inset-2 rounded-full border-t-2 border-secondary animate-spin-reverse" />
                                    </div>
                                </div>
                            )}

                            {/* Empty Filter State */}
                            {!loading && filteredPrograms.length === 0 && (
                                <div className="text-center py-40">
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
                                        <Target className="w-10 h-10 text-gray-200" />
                                    </div>
                                    <h3 className="font-playfair text-3xl font-bold text-primary mb-4">No Missions Found</h3>
                                    <p className="text-gray-400 max-w-sm mx-auto font-outfit font-light">
                                        We couldn't find any active missions matching your criteria. Try adjusting your filters.
                                    </p>
                                    <button
                                        onClick={() => setActiveFilter('all')}
                                        className="mt-8 text-secondary font-bold text-sm tracking-widest uppercase hover:underline underline-offset-8"
                                    >
                                        Clear Filter
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
