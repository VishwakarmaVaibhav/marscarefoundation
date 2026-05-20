/**
 * Programs [slug] layout — provides default metadata.
 * Dynamic metadata (per-program title/description) requires server-side 
 * generateMetadata, but since the page is a client component fetching data
 * client-side, we provide solid fallback metadata here.
 * To get dynamic metadata, consider converting to a server component in the future.
 */

export const metadata = {
    title: 'Program Details — Mars Care Foundation',
    description:
        'Learn about this impactful program by Mars Care Foundation — making real differences in education, healthcare, and community development across rural India.',
    alternates: {
        canonical: '/programs',
    },
    openGraph: {
        title: 'Mars Care Foundation Program',
        description:
            'Discover how this Mars Care Foundation program is transforming lives through education, healthcare, and community development.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Mars Care Foundation Program',
            },
        ],
    },
};

export default function ProgramDetailLayout({ children }) {
    return children;
}
