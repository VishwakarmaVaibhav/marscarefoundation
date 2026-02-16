'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import { formatCurrency, calculateProgress } from '@/lib/utils';

const categoryConfig = {
    education: { color: 'bg-blue-500', gradient: 'from-blue-600 to-indigo-600', shadow: 'shadow-blue-500/30' },
    health: { color: 'bg-emerald-500', gradient: 'from-emerald-600 to-teal-600', shadow: 'shadow-emerald-500/30' },
    'women-empowerment': { color: 'bg-pink-500', gradient: 'from-pink-600 to-rose-600', shadow: 'shadow-pink-500/30' },
    'child-welfare': { color: 'bg-amber-500', gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/30' },
    'elderly-care': { color: 'bg-purple-500', gradient: 'from-purple-600 to-violet-600', shadow: 'shadow-purple-500/30' },
    environment: { color: 'bg-lime-500', gradient: 'from-lime-600 to-green-600', shadow: 'shadow-lime-500/30' },
    other: { color: 'bg-slate-500', gradient: 'from-slate-600 to-gray-600', shadow: 'shadow-slate-500/30' },
};

export default function ProgramCard({ program, index = 0 }) {
    const progress = calculateProgress(program.raisedAmount || program.raised, program.targetAmount || program.target);
    const categoryStyle = categoryConfig[program.category] || categoryConfig.other;

    // Format category label
    const categoryLabel = program.category
        ? program.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
        : 'General';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            className="group relative h-[480px] w-full rounded-[2rem] overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500"
        >
            {/* Background Image with Parallax-like Zoom */}
            <div className="absolute inset-0 overflow-hidden">
                <Image
                    src={program.featuredImage?.url || program.image || '/placeholder-program.jpg'}
                    alt={program.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                {/* Gradient Overlay - Darker at bottom for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
            </div>

            {/* Floating Category Badge */}
            {/* <div className="absolute top-5 right-5 z-20">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-white uppercase bg-gradient-to-r ${categoryStyle.gradient} shadow-lg ${categoryStyle.shadow} backdrop-blur-md border border-white/20`}>
                    {categoryLabel}
                </span>
            </div> */}

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 text-white">

                {/* Main Content */}
                <div className="transform transition-all duration-500 translate-y-4 group-hover:translate-y-0">

                    {/* Title */}
                    <h3 className="font-heading text-3xl font-bold leading-tight mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                        {program.title}
                    </h3>

                    {/* Progress Bar - Always visible but enhanced on hover */}
                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm font-medium text-gray-300">
                            <span>Raised: <span className="text-white font-bold">{formatCurrency(program.raisedAmount || program.raised)}</span></span>
                            <span>{progress}%</span>
                        </div>
                        <div className="relative h-2.5 w-full bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${progress}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className={`h-full rounded-full bg-gradient-to-r ${categoryStyle.gradient}`}
                            />
                        </div>
                    </div>

                    {/* Hidden Description & Action - Reveal on Hover */}
                    <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 overflow-hidden transition-all duration-500 delay-75">
                        <p className="text-gray-300 text-sm mb-6 line-clamp-2 md:line-clamp-3 leading-relaxed">
                            {program.description}
                        </p>

                        <div className="flex items-center gap-3 pb-2">
                            <Link
                                href={`/donate?program=${program.slug}`}
                                className={`flex-1 overflow-hidden relative group/btn px-6 py-3.5 rounded-xl font-bold text-center transition-all hover:scale-[1.02] active:scale-[0.98] bg-white text-gray-900`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Heart className={`w-4 h-4 fill-current ${categoryStyle.color.replace('bg-', 'text-')}`} />
                                    Donate Now
                                </span>
                            </Link>

                            <Link
                                href={`/programs/${program.slug}`}
                                className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-colors text-white"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl mix-blend-overlay animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-3xl mix-blend-overlay animate-pulse animation-delay-400" />
            </div>
        </motion.div>
    );
}
