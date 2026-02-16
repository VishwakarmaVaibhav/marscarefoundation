'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Heart, Users, Target, Calendar, CheckCircle, ChevronDown, Share2, Quote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { programsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ProgramDetail() {
    const { slug } = useParams();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const { scrollY } = useScroll();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Parallax & Opacity effects for Hero
    const y = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const res = await axios.get(`${API_URL}/programs/${slug}`);
                setProgram(res.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch program', error);
                setLoading(false);
            }
        };
        if (slug) fetchProgram();
    }, [slug]);

    if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    if (!program) return <div className="h-screen flex items-center justify-center text-lg text-gray-500">Program not found</div>;

    const percentRaised = Math.min((program.raisedAmount / program.targetAmount) * 100, 100);
    const heroImage = (isMobile && program.featuredImage?.mobileUrl) ? program.featuredImage.mobileUrl : (program.featuredImage?.url || '/hero-bg.jpg');

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            {/* Immersive Hero */}
            <div className="relative h-[85vh] overflow-hidden">
                <motion.div style={{ y }} className="absolute inset-0">
                    <Image
                        key={heroImage}
                        src={heroImage}
                        alt={program.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-[#1A3C5A]/90"></div>
                </motion.div>

                <div className="relative h-full container-custom flex flex-col justify-end pb-24 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-sm font-bold uppercase tracking-wider">
                                {typeof program.category === 'object' ? program.category.title : 'Initiative'}
                            </span>
                            {program.status === 'active' && (
                                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-bold uppercase tracking-wider">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    Active Campaign
                                </span>
                            )}
                        </div>

                        <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-10 text-white">
                            {program.title}
                        </h1>

                        <div className="flex flex-wrap gap-8 text-white/80">
                            <div className="flex items-center gap-3">
                                <Users className="w-6 h-6 text-blue-300" />
                                <div>
                                    <p className="text-xs uppercase tracking-wider opacity-70">Beneficiaries</p>
                                    <p className="font-semibold text-lg">{program.impactMetrics?.beneficiaries || '2,000+'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Target className="w-6 h-6 text-amber-300" />
                                <div>
                                    <p className="text-xs uppercase tracking-wider opacity-70">Goal</p>
                                    <p className="font-semibold text-lg">{formatCurrency(program.targetAmount)}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    style={{ opacity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce"
                >
                    <ChevronDown size={32} />
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="container-custom py-20">
                <div className="grid lg:grid-cols-12 gap-16">

                    {/* Left Column: Story & Features */}
                    <div className="lg:col-span-8 space-y-16">

                        {/* Story/Description */}
                        <section className="relative">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="w-8 h-[2px] bg-secondary" />
                                <h2 className="font-playfair text-4xl font-bold text-primary">The Narrative</h2>
                            </div>
                            <div className="prose prose-2xl prose-blue text-gray-500 max-w-none leading-relaxed font-outfit font-light whitespace-pre-line">
                                <span className="text-secondary text-5xl font-playfair font-bold float-left mr-4 mt-2 leading-none">
                                    {program.description.charAt(0)}
                                </span>
                                {program.description.slice(1)}
                            </div>
                        </section>

                        {/* Features Grid */}
                        {program.features?.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-10">
                                    <span className="w-8 h-[2px] bg-secondary" />
                                    <h3 className="font-playfair text-3xl font-bold text-primary">Strategic Impact</h3>
                                </div>
                                <div className="grid md:grid-cols-2 gap-10">
                                    {program.features.map((feature, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ y: -5 }}
                                            className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-primary/5 transition-all duration-300"
                                        >
                                            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-8 border border-primary/10">
                                                <Target size={30} />
                                            </div>
                                            <h4 className="font-playfair text-2xl font-bold text-primary mb-4">{feature.title}</h4>
                                            <p className="text-gray-500 text-sm leading-relaxed font-outfit">{feature.description}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Program Gallery */}
                        {program.gallery?.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-10">
                                    <span className="w-8 h-[2px] bg-secondary" />
                                    <h3 className="font-playfair text-3xl font-bold text-primary">Visual Chronicles</h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 h-[600px]">
                                    {program.gallery.map((img, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.02 }}
                                            className={`relative rounded-[2rem] overflow-hidden shadow-2xl ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}
                                        >
                                            <Image
                                                src={img.url}
                                                alt={img.alt || 'Program Image'}
                                                fill
                                                className="object-cover transition-transform duration-700 hover:scale-110"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Testimonials */}
                        {program.testimonials?.length > 0 && (
                            <section className="bg-[#1A3C5A] rounded-3xl p-10 md:p-16 text-white relative overflow-hidden">
                                <Quote className="absolute top-10 left-10 text-white/10 w-32 h-32" />
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold mb-10 text-center">Voices from the Community</h3>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {program.testimonials.map((test, idx) => (
                                            <div key={idx} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                                                <p className="text-lg italic text-blue-100 mb-6">"{test.message}"</p>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-blue-400/30 flex items-center justify-center font-bold text-blue-200">
                                                        {test.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">{test.name}</p>
                                                        <p className="text-xs text-blue-200 uppercase tracking-wider">{test.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Sticky Donation Card */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-32">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white rounded-3xl shadow-xl shadow-blue-900/10 border border-gray-100 p-8 overflow-hidden relative"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Help Us Reach Our Goal</h3>
                                <p className="text-gray-500 mb-8 text-sm">Your contribution directly impacts the lives of those in need.</p>

                                <div className="mb-8">
                                    <div className="flex justify-between text-sm font-bold mb-3">
                                        <span className="text-blue-600">{formatCurrency(program.raisedAmount)}</span>
                                        <span className="text-gray-400">of {formatCurrency(program.targetAmount)}</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${percentRaised}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                        />
                                    </div>
                                    <p className="text-right text-xs text-gray-400 mt-2">{percentRaised.toFixed(1)}% Funded</p>
                                </div>

                                <div className="space-y-4">
                                    <Link
                                        href={`/donate?program=${program._id}`}
                                        className="w-full py-4 rounded-xl bg-[#1A3C5A] text-white font-bold text-lg hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                    >
                                        <Heart className="fill-white" size={20} />
                                        Donate to this Cause
                                    </Link>
                                    <button className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                        <Share2 size={18} />
                                        Share Program
                                    </button>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h4 className="font-bold text-sm text-gray-900 mb-4">Why Donate?</h4>
                                    <ul className="space-y-3">
                                        {['Direct Impact', 'Tax Deductible', 'Transparency Report'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                                <CheckCircle size={16} className="text-green-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
