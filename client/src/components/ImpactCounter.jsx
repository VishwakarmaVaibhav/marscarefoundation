'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function ImpactCounter({ icon: Icon, value, label, suffix = '', delay = 0 }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const duration = 2000;
        const steps = 60;
        const stepValue = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += stepValue;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="glass-card p-8 text-center group hover:bg-gray-50 transition-all duration-300 border border-gray-100 shadow-sm"
        >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-mars-orange to-red-500 flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg shadow-mars-orange/20">
                <Icon className="w-8 h-8 text-white" />
            </div>
            <div className="font-heading text-4xl md:text-5xl font-bold text-gray-800 mb-2 counter-value">
                {isVisible && count.toLocaleString('en-IN')}{suffix}
            </div>
            <p className="text-gray-600 font-medium">{label}</p>
        </motion.div>
    );
}
