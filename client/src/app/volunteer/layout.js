export const metadata = {
    title: 'Volunteer — Join Our Mission to Transform Lives in India',
    description:
        'Volunteer with Mars Care Foundation and make a real difference. Join thousands of volunteers across India contributing their time and skills to education, healthcare, and community development programs.',
    keywords: [
        'volunteer India',
        'NGO volunteer India',
        'social work volunteer India',
        'volunteer opportunities India',
        'volunteer for NGO',
        'community volunteer India',
        'social impact volunteer',
    ],
    alternates: {
        canonical: '/volunteer',
    },
    openGraph: {
        title: 'Volunteer with Mars Care Foundation — Make a Real Difference',
        description:
            'Join our volunteer network and contribute your skills to education, healthcare, and community development programs across India.',
        url: 'https://marscarefoundation.in/volunteer',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Volunteer with Mars Care Foundation',
            },
        ],
    },
    twitter: {
        title: 'Volunteer with Mars Care Foundation',
        description:
            'Join our network of volunteers making a difference in education, healthcare & community development across India.',
    },
};

export default function VolunteerLayout({ children }) {
    return children;
}
