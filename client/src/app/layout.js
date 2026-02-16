import '@/styles/globals.css';
import { Inter, Outfit, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SettingsProvider from '@/providers/SettingsProvider';
import VideoPreloader from '@/components/VideoPreloader';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
});

export const metadata = {
    title: 'Mars Care Foundation - Caring for Humanity',
    description: 'Mars Care Foundation is dedicated to transforming lives through education, healthcare, and community development programs across India.',
    keywords: ['NGO', 'charity', 'donation', 'education', 'healthcare', 'India', 'Mars Care Foundation'],
    openGraph: {
        title: 'Mars Care Foundation - Caring for Humanity',
        description: 'Join us in creating positive change through education, healthcare, and community development.',
        type: 'website',
        locale: 'en_IN',
        siteName: 'Mars Care Foundation',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Mars Care Foundation',
        description: 'Caring for Humanity - Join us in making a difference',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable} ${playfair.variable}`}>
            <body className="min-h-screen flex flex-col">
                <VideoPreloader />
                <SettingsProvider>
                    <ScrollToTop />
                    <Header />
                    <main className="flex-grow">
                        {children}
                    </main>
                    <Footer />
                    <Toaster position="top-right" />
                </SettingsProvider>
            </body>
        </html>
    );
}
