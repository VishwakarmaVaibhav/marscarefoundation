export const metadata = {
    title: 'About Us — Best NGO in Mira Road Mumbai | Our Story & Mission',
    description:
        'Learn about Mars Care Foundation — the top registered NGO in Mira Road, Mumbai. Discover our story, mission, vision, and the dedicated team driving education, healthcare, and women empowerment across Maharashtra.',
    keywords: [
        'about Mars Care Foundation',
        'NGO in Mira Road',
        'best NGO Mumbai',
        'top NGO Maharashtra',
        'NGO mission India',
        'social welfare organization Mumbai',
        'community development NGO Mira Road',
        'registered NGO Mumbai',
    ],
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title: 'About Mars Care Foundation — Our Story, Mission & Vision',
        description:
            'Discover how Mars Care Foundation is transforming underprivileged communities across India through education, healthcare, and empowerment.',
        url: 'https://marscarefoundation.in/about',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Mars Care Foundation — Our Story',
            },
        ],
    },
    twitter: {
        title: 'About Mars Care Foundation',
        description:
            'Discover how Mars Care Foundation is transforming underprivileged communities across India.',
    },
};

export default function AboutLayout({ children }) {
    return children;
}
