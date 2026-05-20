export const metadata = {
    title: 'Donate to NGO in Mumbai — Support Education & Healthcare | 80G Tax Benefit',
    description:
        'Donate online to Mars Care Foundation, a top NGO in Mira Road, Mumbai. Your contribution funds child education, medical care, and women empowerment. 80G tax exemption available. UPI, net banking, and card accepted.',
    keywords: [
        'donate to NGO Mumbai',
        'donate NGO Mira Road',
        'online donation Mumbai NGO',
        '80G tax exemption donation Mumbai',
        'donate online India',
        'donate for child education Mumbai',
        'donate for healthcare India',
        'charity donation Mumbai',
        'NGO donation India online',
        'best NGO to donate Mumbai',
    ],
    alternates: {
        canonical: '/donate',
    },
    openGraph: {
        title: 'Donate to Mars Care Foundation — Transform Lives in India',
        description:
            'Your donation funds education, healthcare, and empowerment programs for underprivileged communities in rural India. 80G tax benefit available.',
        url: 'https://marscarefoundation.in/donate',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Donate to Mars Care Foundation',
            },
        ],
    },
    twitter: {
        title: 'Donate to Mars Care Foundation',
        description:
            'Transform lives in rural India with your donation. Education, healthcare & community programs. 80G tax benefit available.',
    },
};

export default function DonateLayout({ children }) {
    return children;
}
