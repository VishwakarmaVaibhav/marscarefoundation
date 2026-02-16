'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { settingsApi } from '@/lib/api';

const SettingsContext = createContext({
    settings: {},
    loading: true,
});

export const useSettings = () => useContext(SettingsContext);

export default function SettingsProvider({ children }) {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await settingsApi.getAll();
            if (res.data.success) {
                setSettings(res.data.data);
                applyTheme(res.data.data.themeColors);
            }
        } catch (error) {
            console.error('Failed to fetch settings', error);
        } finally {
            setLoading(false);
        }
    };

    const applyTheme = (colors) => {
        if (!colors) return;
        const root = document.documentElement;

        // Map API colors to CSS variables
        const colorMap = {
            primary: '--color-primary',
            secondary: '--color-secondary',
            accent: '--color-accent',
            background: '--color-background',
            cardBg: '--color-card',
            text: '--color-text'
        };

        Object.entries(colors).forEach(([key, value]) => {
            if (colorMap[key]) {
                root.style.setProperty(colorMap[key], value);
            }
        });
    };

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
}
