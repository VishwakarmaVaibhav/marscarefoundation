export const metadata = {
    title: 'Gallery — Impact in Pictures',
    description:
        'Explore the Mars Care Foundation photo gallery showcasing real impact stories — education camps, healthcare drives, community events, and volunteer activities across India.',
    keywords: [
        'Mars Care Foundation gallery',
        'NGO India photos',
        'community development India photos',
        'education camp photos India',
        'healthcare drive photos India',
        'NGO impact photos',
    ],
    alternates: {
        canonical: '/gallery',
    },
    openGraph: {
        title: 'Mars Care Foundation Gallery — Impact in Pictures',
        description:
            'See the real stories behind our work — education camps, healthcare drives, and community events across India.',
        url: 'https://marscarefoundation.in/gallery',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Mars Care Foundation Impact Gallery',
            },
        ],
    },
};

export default function GalleryLayout({ children }) {
    return children;
}
