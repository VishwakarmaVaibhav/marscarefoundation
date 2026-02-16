'use client';

import Link from 'next/link';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const quickLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/programs', label: 'Our Programs' },
    { href: '/donate', label: 'Donate' },
    { href: '/volunteer', label: 'Volunteer' },
    { href: '/gallery', label: 'Success Stories' },
    { href: '/contact', label: 'Contact Us' },
];

const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Twitter, label: 'Twitter' },
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Linkedin, label: 'LinkedIn' },
    { href: '#', icon: Youtube, label: 'YouTube' },
];

export default function Footer() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            await api.post('/newsletter/subscribe', { email });
            toast.success('Successfully subscribed to our newsletter!');
            setEmail('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to subscribe. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="bg-[#1A3C5A] text-white pt-20 px-4 md:px-0 pb-10">
            {/* Premium Newsletter Section */}
            <div className="container-custom mb-20">
                <div className="relative overflow-hidden rounded-[3rem] bg-[#0A1A2F] p-10 md:p-16 border border-white/5 shadow-2xl">
                    {/* Artistic Background Elements */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-8 h-[1px] bg-secondary" />
                                <span className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px]">Newsletter Syndicate</span>
                            </div>
                            <h3 className="font-playfair text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Stay Updated with <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Our Human Impact</span>
                            </h3>
                            <p className="text-white/50 font-outfit text-sm md:text-md max-w-md leading-relaxed">
                                Join our community to receive heartwarming success stories and updates about our missions directly in your inbox.
                            </p>
                        </div>

                        <div className="relative group">
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 p-2 bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-full border border-white/10 focus-within:border-secondary/50 transition-colors">
                                <input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 px-6 py-4 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 text-sm font-medium"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-10 py-4 bg-secondary text-white font-bold text-sm rounded-xl md:rounded-full hover:bg-white hover:text-primary transition-all shadow-lg hover:shadow-secondary/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Subscribe Now'}
                                </button>
                            </form>
                            <p className="mt-4 text-[10px] text-white/30 text-center lg:text-left font-medium tracking-wider uppercase">
                                No spam. Just pure impact. Unsubscribe anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
                    {/* About */}
                    <div>
                        {/* Logo */}
                        <Link href="/" className="flex items-center pb-4 gap-3 group">
                            <div className="w-16 h-16 rounded-full overflow-hidden transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center bg-white">
                                <img src="/Ngologo.png" alt="Mars Care Logo" className="w-full h-full object-cover" />
                            </div>
                        </Link>
                        <p className="text-white/70 mb-6 leading-relaxed">
                            Mars Care Foundation is dedicated to transforming lives through education,
                            healthcare, and community development programs across India.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-secondary hover:text-white transition-all transform hover:-translate-y-1"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading font-semibold text-lg text-white mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/70 hover:text-secondary transition-colors flex items-center gap-2 group"
                                    >
                                        <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Programs */}


                    {/* Contact */}
                    <div>
                        <h4 className="font-heading font-semibold text-lg text-white mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-white/70">
                                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                                <span>123 NGO Street, Mumbai, Maharashtra, India - 400001</span>
                            </li>
                            <li>
                                <a href="tel:+919876543210" className="flex items-center gap-3 text-white/70 hover:text-secondary transition-colors">
                                    <Phone className="w-5 h-5 text-secondary" />
                                    +91 98765 43210
                                </a>
                            </li>
                            <li>
                                <a href="mailto:info@marscarefoundation.org" className="flex items-center gap-3 text-white/70 hover:text-secondary transition-colors">
                                    <Mail className="w-5 h-5 text-secondary" />
                                    info@marscarefoundation.org
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm">
                        © {new Date().getFullYear()} Mars Care Foundation. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link href="/privacy" className="text-white/40 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-white/40 hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/80g" className="text-white/40 hover:text-white transition-colors">
                            80G Certificate
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
