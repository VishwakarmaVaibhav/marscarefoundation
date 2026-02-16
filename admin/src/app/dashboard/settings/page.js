'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw, Palette } from 'lucide-react';
import { settingsApi } from '@/lib/api';
import { toast } from 'sonner';

import ConfirmModal from '@/components/ConfirmModal';
import Loader from '@/components/Loader';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        siteName: '',
        siteTagline: '',
        contactEmail: '',
        themeColors: {
            primary: '#1A3C5A',
            secondary: '#F4A261',
            accent: '#4A7C78',
            background: '#F9F7F4',
            cardBg: '#EFECE6',
            text: '#2D3748'
        }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [confirmResetOpen, setConfirmResetOpen] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await settingsApi.getAll();
            if (res.data.data) {
                setSettings(prev => ({ ...prev, ...res.data.data }));
            }
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load settings');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleColorChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            themeColors: { ...prev.themeColors, [key]: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await settingsApi.updateAll(settings);
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setSettings(prev => ({
            ...prev,
            themeColors: {
                primary: '#1A3C5A',
                secondary: '#F4A261',
                accent: '#4A7C78',
                background: '#F9F7F4',
                cardBg: '#EFECE6',
                text: '#2D3748'
            }
        }));
        setConfirmResetOpen(false);
        toast.success('Reset to defaults');
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Loader size="large" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <ConfirmModal
                isOpen={confirmResetOpen}
                onClose={() => setConfirmResetOpen(false)}
                onConfirm={handleReset}
                title="Reset Defaults"
                message="Are you sure you want to reset the theme colors to the Grounded Hope defaults? This action will not be saved until you click 'Save Changes'."
            />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Site Settings</h1>
                    <p className="text-white/60">Manage global configuration and appearance</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-mars-orange to-mars-red rounded-lg text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                    <Save className="w-4 h-4" />
                    {saving ? <Loader size="small" color="border-white" /> : 'Save Changes'}
                </button>
            </div>

            <div className="grid gap-8">
                {/* General Settings */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                    <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-4">General Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Site Name</label>
                            <input
                                type="text"
                                name="siteName"
                                value={settings.siteName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-mars-orange"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Tagline</label>
                            <input
                                type="text"
                                name="siteTagline"
                                value={settings.siteTagline}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-mars-orange"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Contact Email</label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={settings.contactEmail}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-mars-orange"
                            />
                        </div>
                    </div>
                </section>

                {/* Theme Settings */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Palette className="w-5 h-5 text-mars-orange" />
                            Theme Colors
                        </h2>
                        <button
                            onClick={() => setConfirmResetOpen(true)}
                            className="text-xs flex items-center gap-1 text-white/40 hover:text-white transition-colors"
                        >
                            <RefreshCw className="w-3 h-3" />
                            Reset Defaults
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(settings.themeColors || {}).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                                <label className="text-sm font-medium text-white/80 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg border border-white/20 shadow-inner" style={{ backgroundColor: value }} />
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => handleColorChange(key, e.target.value)}
                                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-mars-orange"
                                    />
                                    <input
                                        type="color"
                                        value={value}
                                        onChange={(e) => handleColorChange(key, e.target.value)}
                                        className="w-10 h-10 p-0 bg-transparent border-0 rounded cursor-pointer"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
