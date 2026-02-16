'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import {
    Facebook,
    Instagram,
    Linkedin,
    Youtube,
    Twitter
} from 'lucide-react';
import { Button } from './button';
import Lenis from '@studio-freight/lenis';
import Link from 'next/link';

// Social Links adapting to Mars Care
const socialLinks = [
    { title: 'Facebook', href: '#', icon: Facebook },
    { title: 'Twitter', href: '#', icon: Twitter },
    { title: 'Instagram', href: '#', icon: Instagram },
    { title: 'Youtube', href: '#', icon: Youtube },
    { title: 'LinkedIn', href: '#', icon: Linkedin },
];

const footerLinkGroups = [
    {
        label: 'Our Mission',
        links: [
            { title: 'About Us', href: '/about' },
            { title: 'Our Programs', href: '/programs' },
            { title: 'Success Stories', href: '/stories' },
            { title: 'Gallery', href: '/gallery' },
        ],
    },
    {
        label: 'Get Involved',
        links: [
            { title: 'Donate Now', href: '/donate' },
            { title: 'Volunteer', href: '/volunteer' },
            { title: 'Partner with Us', href: '/contact?type=partnership' },
            { title: 'Corporate CSR', href: '/contact?type=corporate' },
        ],
    },
    {
        label: 'Programs',
        links: [
            { title: 'Education', href: '/programs/education' },
            { title: 'Healthcare', href: '/programs/healthcare' },
            { title: 'Women Empowerment', href: '/programs/women-empowerment' },
            { title: 'Child Welfare', href: '/programs/child-welfare' },
            { title: 'Rural Development', href: '/programs/rural-development' },
        ],
    },
    {
        label: 'Support',
        links: [
            { title: 'Contact Us', href: '/contact' },
            { title: 'FAQs', href: '/faq' },
            { title: 'Privacy Policy', href: '/privacy' },
            { title: 'Terms of Service', href: '/terms' },
        ],
    },
];

function AnimatedContainer({
    delay = 0.1,
    children,
    ...props
}) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return children;
    }

    return (
        <motion.div
            initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function StickyFooter({ className, ...props }) {

    // Initialize Lenis for smooth scrolling if used in this component scope, 
    // or rely on global lenis if implemented. 
    // The user provided demo code initializes Lenis. We'll add it here for safety.
    useEffect(() => {
        const lenis = new Lenis();
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <footer
            className={cn('relative h-[720px] w-full', className)}
            style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
            {...props}
        >
            <div className="fixed bottom-0 h-[720px] w-full px-4 pb-4">
                <div className="sticky top-[calc(100vh-720px)] h-full overflow-y-auto bg-primary text-white rounded-3xl">
                    <div className="relative flex size-full flex-col justify-between gap-5 border-t border-white/10 px-4 py-8 md:px-12">
                        <div
                            aria-hidden
                            className="absolute inset-0 isolate z-0 contain-strict opacity-20 pointer-events-none"
                        >
                            {/* Abstract Decorative Elements */}
                            <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,theme('colors.secondary')_0,hsla(0,0%,100%,.02)_50%,transparent_80%)] absolute top-0 left-0 h-[320px] w-[140px] -translate-y-[87.5%] -rotate-45 rounded-full blur-3xl" />
                            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,theme('colors.accent')_0,transparent_100%)] absolute top-0 left-0 h-[320px] w-[60px] translate-x-[5%] -translate-y-[50%] -rotate-45 rounded-full blur-3xl" />
                        </div>

                        <div className="mt-10 flex flex-col gap-8 md:flex-row xl:mt-0 relative z-10">
                            <AnimatedContainer className="w-full max-w-sm min-w-xs space-y-4">
                                <div className="flex items-center gap-3">
                                    {/* Logo */}
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1">
                                        <img src="/Ngologo.png" alt="Mars Care Logo" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-bold text-xl text-white">Mars Care</h3>
                                        <span className="text-xs text-white/60">Foundation</span>
                                    </div>
                                </div>
                                <p className="text-white/70 mt-8 text-sm md:mt-4 leading-relaxed">
                                    Mars Care Foundation is dedicated to transforming lives through education,
                                    healthcare, and community development programs across India.
                                </p>
                                <div className="flex gap-2">
                                    {socialLinks.map((link) => (
                                        <Button key={link.title} size="icon" variant="outline" className="size-8 bg-white/10 border-white/20 hover:bg-secondary hover:text-white text-white">
                                            <link.icon className="size-4" />
                                        </Button>
                                    ))}
                                </div>
                            </AnimatedContainer>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
                                {footerLinkGroups.map((group, index) => (
                                    <AnimatedContainer
                                        key={group.label}
                                        delay={0.1 + index * 0.1}
                                        className="w-full"
                                    >
                                        <div className="mb-10 md:mb-0">
                                            <h3 className="text-sm uppercase font-bold text-secondary mb-4">{group.label}</h3>
                                            <ul className="space-y-3 text-sm md:text-xs lg:text-sm">
                                                {group.links.map((link) => (
                                                    <li key={link.title}>
                                                        <Link
                                                            href={link.href}
                                                            className="text-white/70 hover:text-white transition-all duration-300 flex items-center gap-2"
                                                        >
                                                            {link.title}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </AnimatedContainer>
                                ))}
                            </div>
                        </div>

                        <div className="text-white/40 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm relative z-10">
                            <p>© 2026 Mars Care Foundation. All rights reserved.</p>
                            <div className="flex gap-4">
                                <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                                <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
