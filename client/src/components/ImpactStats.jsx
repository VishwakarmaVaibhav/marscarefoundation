'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { Users, Heart, School, Sprout } from 'lucide-react';

const stats = [
    {
        icon: Users,
        value: 50000,
        label: 'Lives Impacted',
        suffix: '+',
        color: 'text-blue-500',
        bg: 'bg-blue-50'
    },
    {
        icon: School,
        value: 120,
        label: 'Schools Supported',
        suffix: '',
        color: 'text-yellow-500',
        bg: 'bg-yellow-50'
    },
    {
        icon: Heart,
        value: 8500,
        label: 'Medical Checkups',
        suffix: '+',
        color: 'text-red-500',
        bg: 'bg-red-50'
    },
    {
        icon: Sprout,
        value: 25,
        label: 'Villages Adopted',
        suffix: '',
        color: 'text-green-500',
        bg: 'bg-green-50'
    }
];

function Counter({ value, suffix }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
        duration: 2
    });

    // Check if window is defined to avoid SSR issues
    const displayValue = useTransform(springValue, (current) => {
        if (typeof window === 'undefined') return 0;
        return Math.round(current).toLocaleString();
    });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    return (
        <span ref={ref} className="tabular-nums">
            <motion.span>{displayValue}</motion.span>{suffix}
        </span>
    );
}

export default function ImpactStats() {
    return (
        <section className="py-24 px-4 md:px-0 relative overflow-hidden bg-background">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl" />
            </div>

            <div className="container-custom relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block px-5 py-2 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold tracking-[0.2em] uppercase mb-6"
                    >
                        Our Global Footprint
                    </motion.span>
                    <h2 className="font-playfair text-4xl md:text-6xl font-bold text-primary mb-8 leading-tight">
                        Making a <span className="text-secondary italic">
                            Real Difference
                        </span>
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed font-outfit font-light">
                        Behind every metric is a human story. We measure our success not just in statistics, but in the smiles restored and futures transformed.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, type: "spring", stiffness: 50 }}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-white rounded-3xl shadow-xl shadow-primary/5 transform transition-transform duration-300 group-hover:scale-[1.02]" />
                            <div className="relative p-8 flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-300`}>
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <div className="font-playfair text-5xl font-bold text-primary mb-3">
                                    <Counter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                                    {stat.label}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
