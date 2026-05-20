export const metadata = {
    title: 'Contact Us — Get in Touch with Mars Care Foundation',
    description:
        'Contact Mars Care Foundation for partnerships, donations, volunteering, or media inquiries. We are committed to transparent communication and swift responses to all queries.',
    keywords: [
        'contact Mars Care Foundation',
        'NGO contact India',
        'Mars Care Foundation address',
        'donate contact India',
        'NGO partnership India',
    ],
    alternates: {
        canonical: '/contact',
    },
    openGraph: {
        title: 'Contact Mars Care Foundation',
        description:
            'Get in touch with Mars Care Foundation for partnerships, donations, volunteering, or media inquiries.',
        url: 'https://marscarefoundation.in/contact',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Contact Mars Care Foundation',
            },
        ],
    },
};

export default function ContactLayout({ children }) {
    return children;
}
