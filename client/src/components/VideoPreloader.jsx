'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export default function VideoPreloader() {
    const [show, setShow] = useState(true);
    const [isMobile, setIsMobile] = useState(false);


    // Config: Inactivity threshold in milliseconds (e.g., 10 minutes)
    const INACTIVITY_THRESHOLD = 10 * 60 * 1000;

    useEffect(() => {
        const checkInactivity = () => {
            const lastActive = localStorage.getItem('lastActiveTime');
            const now = Date.now();

            // Detect page reload
            const navEntries = performance.getEntriesByType('navigation');
            const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';

            if (isReload) {
                // If user reloaded the page, always show the video
                setShow(true);
            } else if (lastActive) {
                const timeSinceLastActive = now - parseInt(lastActive, 10);

                // If user was active recently (less than threshold), don't show loader
                if (timeSinceLastActive < INACTIVITY_THRESHOLD) {
                    setShow(false);
                } else {
                    // User was inactive for long enough, show loader
                    setShow(true);
                }
            } else {
                // First visit ever (or cleared storage), show loader
                setShow(true);
            }

            // Update last active time continuously while user is here
            localStorage.setItem('lastActiveTime', now.toString());
        };

        checkInactivity();

        // Heartbeat: Update 'lastActiveTime' every minute while the user is on the site
        const interval = setInterval(() => {
            localStorage.setItem('lastActiveTime', Date.now().toString());
        }, 60000); // 1 minute

        // Also update on unload just in case
        const handleUnload = () => {
            localStorage.setItem('lastActiveTime', Date.now().toString());
        };
        window.addEventListener('beforeunload', handleUnload);

        return () => {
            clearInterval(interval);
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, []);

    // Hydration fix: only render after mount
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!mounted) return null;


    return (
        <AnimatePresence mode="wait">
            {show && (
                <motion.div
                    key="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
                >
                    <video
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                        onEnded={() => setShow(false)}
                    >
                        <source
                            src="/longvideomob.mp4"
                            type="video/mp4"
                            media="(max-width: 768px)"
                        />
                        <source
                            src="/logovideo.mp4"
                            type="video/mp4"
                        />
                    </video>


                    {/* Skip Button */}
                    <div className="absolute bottom-8 right-8 z-20 flex gap-4">
                        <button
                            onClick={() => setShow(false)}
                            className="text-black/50 hover:text-grey text-sm uppercase tracking-widest font-bold px-4 py-2 border border-black/20 rounded-full hover:bg-grey/10 transition-all"
                        >
                            Skip
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
