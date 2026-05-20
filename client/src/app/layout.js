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
    display: 'swap',
});

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

export const metadata = {
    metadataBase: new URL('https://marscarefoundation.in'),
    title: {
        default: 'Mars Care Foundation — Best NGO in Mira Road Mumbai | Education, Healthcare & Community Development',
        template: '%s | Mars Care Foundation',
    },
    description:
        'Mars Care Foundation is a top registered NGO in Mira Road, Mumbai, Maharashtra. We transform underprivileged lives through child education, rural healthcare, women empowerment, and community development. Donate online with 80G tax benefit.',
    keywords: [
        // Brand
        'Mars Care Foundation',
        'Mars Care NGO',
        'marscarefoundation.in',
        // Local — Mira Road
        'NGO in Mira Road',
        'best NGO in Mira Road',
        'NGO Mira Road Mumbai',
        'charity Mira Road',
        'social work Mira Road',
        'volunteer Mira Road',
        'donation Mira Road',
        // Local — Mumbai
        'NGO in Mumbai',
        'best NGO in Mumbai',
        'top NGO Mumbai',
        'charity Mumbai',
        'NGO Mumbai Maharashtra',
        'social welfare NGO Mumbai',
        'donate to NGO Mumbai',
        'registered NGO Mumbai',
        // Local — Thane / Bhayandar
        'NGO in Thane',
        'NGO Bhayandar',
        'NGO in Navi Mumbai',
        'NGO Maharashtra',
        // National Rankings
        'best NGO India',
        'top 10 NGO India',
        'top NGO in India',
        'best charity India',
        'best registered NGO India',
        'top rated NGO India',
        'list of NGO in India',
        // Cause-specific
        'child education NGO India',
        'child NGO Mumbai',
        'NGO for children India',
        'education NGO India',
        'healthcare NGO India',
        'women empowerment NGO India',
        'rural development NGO India',
        'community development NGO',
        'NGO for poor India',
        'NGO for underprivileged India',
        // Donation
        'donate to NGO India',
        'online donation NGO India',
        '80G donation India',
        '80G tax exemption NGO',
        'donate for education India',
        'donate for healthcare India',
        'donate online India',
        'Indian charity donation',
        // Volunteer
        'volunteer India NGO',
        'volunteer Mumbai',
        'social work volunteer India',
        // General
        'NGO India',
        'charity India',
        'social welfare India',
        'NGO registration India',
    ],
    authors: [{ name: 'Mars Care Foundation', url: 'https://marscarefoundation.in' }],
    creator: 'Mars Care Foundation',
    publisher: 'Mars Care Foundation',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Mars Care Foundation — NGO for Education, Healthcare & Community Development',
        description:
            'Join Mars Care Foundation in creating positive change. Donate, volunteer, or partner with us to transform lives through education, healthcare, and community programs across India.',
        type: 'website',
        locale: 'en_IN',
        url: 'https://marscarefoundation.in',
        siteName: 'Mars Care Foundation',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Mars Care Foundation — Caring for Humanity',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Mars Care Foundation — Caring for Humanity',
        description:
            'Join Mars Care Foundation in transforming lives across India through education, healthcare, and community development.',
        images: ['/og-image.jpg'],
        site: '@MarsCareNGO',
        creator: '@MarsCareNGO',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        // Replace 'PASTE_YOUR_TOKEN_HERE' with the token from Google Search Console
        google: 'PASTE_YOUR_TOKEN_HERE',
    },
    category: 'charity',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en-IN" className={`${inter.variable} ${outfit.variable} ${playfair.variable}`}>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            </head>
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
