'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube, ExternalLink, Heart } from 'lucide-react';
import { useSettings } from '@/providers/SettingsProvider';
import { programsApi } from '@/lib/api';

const initialNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/programs', label: 'Our Programs' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/volunteer', label: 'Volunteer' },
    { href: '/contact', label: 'Contact' },
];

export default function Header() {
    const { settings } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const navLinks = initialNavLinks; // No longer dynamic

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Social Icon mapping
    const getSocialIcon = (platform) => {
        switch (platform) {
            case 'facebook': return Facebook;
            case 'twitter': return Twitter;
            case 'instagram': return Instagram;
            case 'linkedin': return Linkedin;
            case 'youtube': return Youtube;
            default: return ExternalLink;
        }
    };

    return (
        <>
            {/* Top Bar - Trust & Contact */}
            <div className="bg-primary text-white py-2 hidden md:block border-b border-white/10 relative z-50">
                <div className="container-custom flex justify-between items-center text-sm">
                    <div className="flex items-center gap-6">
                        {settings.contactPhone && (
                            <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-2 hover:text-secondary transition-colors">
                                <Phone className="w-4 h-4" />
                                <span>{settings.contactPhone}</span>
                            </a>
                        )}
                        {settings.contactEmail && (
                            <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-2 hover:text-secondary transition-colors">
                                <Mail className="w-4 h-4" />
                                <span>{settings.contactEmail}</span>
                            </a>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Social Links from Settings */}
                        {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map(platform => {
                            const urlKey = `${platform}Url`;
                            if (settings[urlKey]) {
                                const Icon = getSocialIcon(platform);
                                return (
                                    <a key={platform} href={settings[urlKey]} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                                        <Icon className="w-4 h-4" />
                                    </a>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            </div>

            <header
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled
                    ? 'top-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-2'
                    : 'top-0 pb-20 bg-gradient-to-b from-black/50 to-transparent pt-14'
                    }`}
            >
                <div className="container-custom">
                    <nav className="flex items-center justify-between h-16 px-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-16 h-16 rounded-full overflow-hidden transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center bg-white">
                                <img src="/Ngologo.png" alt="Mars Care Logo" className="w-full h-full object-cover" />
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-2">
                            {navLinks.map((link) => (
                                <div
                                    key={link.href}
                                    className="relative"
                                    onMouseEnter={() => link.submenu && link.submenu.length > 0 && setActiveSubmenu(link.href)}
                                    onMouseLeave={() => setActiveSubmenu(null)}
                                >
                                    <Link
                                        href={link.href}
                                        className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${scrolled
                                            ? 'text-text hover:bg-background hover:text-primary'
                                            : 'text-white/90 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {link.label}
                                        {link.submenu && link.submenu.length > 0 && <ChevronDown className="w-3 h-3" />}
                                    </Link>

                                    {/* Submenu */}
                                    {link.submenu && link.submenu.length > 0 && (
                                        <AnimatePresence>
                                            {activeSubmenu === link.href && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden py-2"
                                                >
                                                    {link.submenu.map((sublink) => (
                                                        <Link
                                                            key={sublink.href}
                                                            href={sublink.href}
                                                            className="block px-5 py-3 text-sm text-text hover:bg-background hover:text-primary transition-colors"
                                                            onClick={() => setActiveSubmenu(null)}
                                                        >
                                                            {sublink.label}
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </div>
                            ))}

                            <Link
                                href="/donate"
                                className={`ml-4 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${scrolled
                                    ? 'bg-secondary text-white hover:bg-secondary/90 shadow-md hover:shadow-lg'
                                    : 'bg-white text-primary hover:bg-gray-100'
                                    }`}
                            >
                                Donate Now
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-primary hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </nav>
                </div>

                {/* Mobile Navigation Overlay */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl overflow-hidden"
                        >
                            <div className="container-custom py-6 space-y-4">
                                {navLinks.map((link) => (
                                    <div key={link.href}>
                                        {link.submenu && link.submenu.length > 0 ? (
                                            <div className="space-y-2">
                                                <div className="font-heading font-semibold text-primary px-4">
                                                    {link.label}
                                                </div>
                                                <div className="pl-4 space-y-1">
                                                    {link.submenu.map((sublink) => (
                                                        <Link
                                                            key={sublink.href}
                                                            href={sublink.href}
                                                            className="block px-4 py-2 text-sm text-text-light hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            {sublink.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                className="block px-4 py-2 font-medium text-text hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {link.label}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                                <div className="pt-4 px-4 border-t border-gray-100">
                                    <Link
                                        href="/donate"
                                        className="btn-primary w-full flex items-center justify-center"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Donate Now
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
}
