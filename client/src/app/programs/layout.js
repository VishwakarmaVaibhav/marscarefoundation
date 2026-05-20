export const metadata = {
    title: 'Our Programs — Top NGO Programs in Mumbai for Education & Healthcare',
    description:
        'Explore Mars Care Foundation NGO programs in Mira Road, Mumbai — from education for underprivileged children, rural healthcare camps, to women vocational training and village development across Maharashtra.',
    keywords: [
        'NGO programs Mumbai',
        'NGO programs Mira Road',
        'education programs Mumbai NGO',
        'rural healthcare programs Maharashtra',
        'women empowerment programs Mumbai',
        'community development programs India',
        'child education NGO Mumbai',
        'best NGO programs India',
    ],
    alternates: {
        canonical: '/programs',
    },
    openGraph: {
        title: 'Mars Care Foundation Programs — Education, Healthcare & Community Development',
        description:
            'Explore our impactful programs in education, healthcare, and community development transforming lives across rural India.',
        url: 'https://marscarefoundation.in/programs',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Mars Care Foundation Programs',
            },
        ],
    },
    twitter: {
        title: 'Mars Care Foundation Programs',
        description:
            'Explore impactful programs in education, healthcare & community development across rural India.',
    },
};

export default function ProgramsLayout({ children }) {
    return children;
}
