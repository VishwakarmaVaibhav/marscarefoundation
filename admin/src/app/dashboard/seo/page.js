'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, FileCode, Save, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function SEOPage() {
    const [settings, setSettings] = useState({
        // General SEO
        defaultMetaTitle: 'Mars Care Foundation - Caring for Humanity',
        defaultMetaDescription: 'Mars Care Foundation is dedicated to transforming lives through education, healthcare, and community development programs.',
        defaultMetaKeywords: 'NGO, charity, donation, education, healthcare, India',
        googleAnalyticsId: '',
        googleSearchConsoleId: '',

        // Social Media
        ogImage: '',
        twitterHandle: '@marscarefound',

        // Schema
        organizationType: 'NGO',
        foundingDate: '2020-01-01',

        // Sitemap
        sitemapEnabled: true,
        robotsTxt: `User-agent: *
Allow: /

Sitemap: https://marscarefoundation.org/sitemap.xml`,
    });

    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.put('/settings', settings);
            toast.success('SEO settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-white">SEO Control Room</h1>
                    <p className="text-white/50">Optimize your site for search engines</p>
                </div>
                <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-2">
                    {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Meta Tags */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-heading font-semibold text-white">Meta Tags</h2>
                            <p className="text-white/50 text-sm">Default meta tags for pages</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-white/70 text-sm mb-2">Default Meta Title</label>
                            <input
                                type="text"
                                value={settings.defaultMetaTitle}
                                onChange={(e) => setSettings({ ...settings, defaultMetaTitle: e.target.value })}
                                className="input-field"
                            />
                            <p className="text-white/40 text-xs mt-1">{settings.defaultMetaTitle.length}/60 characters</p>
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-2">Default Meta Description</label>
                            <textarea
                                value={settings.defaultMetaDescription}
                                onChange={(e) => setSettings({ ...settings, defaultMetaDescription: e.target.value })}
                                className="input-field resize-none"
                                rows={3}
                            />
                            <p className="text-white/40 text-xs mt-1">{settings.defaultMetaDescription.length}/160 characters</p>
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-2">Meta Keywords</label>
                            <input
                                type="text"
                                value={settings.defaultMetaKeywords}
                                onChange={(e) => setSettings({ ...settings, defaultMetaKeywords: e.target.value })}
                                className="input-field"
                                placeholder="Comma separated keywords"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Analytics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                            <Search className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-heading font-semibold text-white">Analytics & Tracking</h2>
                            <p className="text-white/50 text-sm">Connect your analytics tools</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-white/70 text-sm mb-2">Google Analytics ID</label>
                            <input
                                type="text"
                                value={settings.googleAnalyticsId}
                                onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                                className="input-field"
                                placeholder="G-XXXXXXXXXX"
                            />
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-2">Search Console Verification</label>
                            <input
                                type="text"
                                value={settings.googleSearchConsoleId}
                                onChange={(e) => setSettings({ ...settings, googleSearchConsoleId: e.target.value })}
                                className="input-field"
                                placeholder="Verification code"
                            />
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-2">Twitter Handle</label>
                            <input
                                type="text"
                                value={settings.twitterHandle}
                                onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })}
                                className="input-field"
                                placeholder="@yourhandle"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Robots.txt */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 lg:col-span-2"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <FileCode className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-heading font-semibold text-white">Robots.txt</h2>
                            <p className="text-white/50 text-sm">Control search engine crawling</p>
                        </div>
                    </div>

                    <textarea
                        value={settings.robotsTxt}
                        onChange={(e) => setSettings({ ...settings, robotsTxt: e.target.value })}
                        className="input-field font-mono text-sm resize-none"
                        rows={8}
                    />
                </motion.div>
            </div>
        </div>
    );
}
