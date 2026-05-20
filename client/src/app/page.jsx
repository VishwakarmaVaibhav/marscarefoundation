'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Users, GraduationCap, Stethoscope, ArrowRight } from 'lucide-react';
import ImpactCounter from '@/components/ImpactCounter';
import ProgramCard from '@/components/ProgramCard';
import ImpactStats from '@/components/ImpactStats';
import DonationWidget from '@/components/DonationWidget';
import HeroSection from '@/components/HeroSection';
import BlogSection from '@/components/BlogSection';
import JsonLd from '@/components/JsonLd';
import { programsApi } from '@/lib/api';

const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['NGO', 'Organization'],
    name: 'Mars Care Foundation',
    alternateName: ['Mars Care NGO', 'Mars Care', 'Mars Care Foundation Mira Road', 'Mars Care NGO Mumbai'],
    url: 'https://marscarefoundation.in',
    logo: {
        '@type': 'ImageObject',
        url: 'https://marscarefoundation.in/Ngologo.png',
        width: 512,
        height: 512,
    },
    image: 'https://marscarefoundation.in/og-image.jpg',
    description:
        'Mars Care Foundation is a registered Indian NGO based in Mira Road, Mumbai. We are dedicated to transforming underprivileged lives through education, healthcare, women empowerment, and sustainable community development across Mumbai, Mira Road, Thane, and rural Maharashtra.',
    foundingDate: '2020',
    areaServed: [
        { '@type': 'City', name: 'Mira Road' },
        { '@type': 'City', name: 'Mumbai' },
        { '@type': 'City', name: 'Thane' },
        { '@type': 'State', name: 'Maharashtra' },
        { '@type': 'Country', name: 'India' },
    ],
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Mira Road',
        addressLocality: 'Mira Road',
        addressRegion: 'Maharashtra',
        postalCode: '401107',
        addressCountry: 'IN',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: 19.2947,
        longitude: 72.8682,
    },
    sameAs: [
        'https://www.facebook.com/MarsCareFoundation',
        'https://twitter.com/MarsCareNGO',
        'https://www.instagram.com/marscarefoundation',
        'https://www.linkedin.com/company/mars-care-foundation',
    ],
    contactPoint: [
        {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            availableLanguage: ['English', 'Hindi', 'Marathi'],
            telephone: '+91-98765-43210',
            email: 'info@marscarefoundation.in',
        },
        {
            '@type': 'ContactPoint',
            contactType: 'donations',
            availableLanguage: ['English', 'Hindi'],
            url: 'https://marscarefoundation.in/donate',
        },
    ],
    knowsAbout: [
        'Child Education',
        'Rural Healthcare',
        'Women Empowerment',
        'Community Development',
        'Poverty Alleviation',
        'Skill Development',
        'Village Adoption',
        'Medical Camps',
        'Scholarship Programs',
    ],
    hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'NGO Programs',
        itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Child Education Program' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Rural Healthcare Camps' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Women Vocational Training' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Village Development Initiative' } },
        ],
    },
    memberOf: {
        '@type': 'Organization',
        name: 'NGO Network India',
    },
    numberOfEmployees: {
        '@type': 'QuantitativeValue',
        minValue: 10,
        maxValue: 100,
    },
    taxID: '80G',
    nonprofitStatus: 'Nonprofit501c3Equivalent',
};

const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'NGO'],
    name: 'Mars Care Foundation',
    description: 'Best NGO in Mira Road Mumbai — Mars Care Foundation works for child education, rural healthcare, and women empowerment.',
    url: 'https://marscarefoundation.in',
    telephone: '+91-98765-43210',
    email: 'info@marscarefoundation.in',
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Mira Road',
        addressLocality: 'Mira Road',
        addressRegion: 'Maharashtra',
        postalCode: '401107',
        addressCountry: 'IN',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: 19.2947,
        longitude: 72.8682,
    },
    openingHoursSpecification: [
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00',
        },
    ],
    image: 'https://marscarefoundation.in/og-image.jpg',
    priceRange: 'Free',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Bank Transfer, Online',
    hasMap: 'https://maps.google.com/?q=Mira+Road+Mumbai+NGO',
    areaServed: [
        'Mira Road', 'Bhayandar', 'Mumbai', 'Thane', 'Navi Mumbai', 'Maharashtra'
    ],
    serviceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
            '@type': 'GeoCoordinates',
            latitude: 19.2947,
            longitude: 72.8682,
        },
        geoRadius: '50000',
    },
};

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'Which is the best NGO in Mira Road Mumbai?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Mars Care Foundation is one of the top NGOs in Mira Road, Mumbai. We work for child education, healthcare, and women empowerment across Mumbai and surrounding areas.',
            },
        },
        {
            '@type': 'Question',
            name: 'Which is the best NGO in Mumbai?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Mars Care Foundation is a leading NGO in Mumbai working on education, healthcare, and community development. We have impacted 50,000+ lives across Mumbai, Mira Road, and rural Maharashtra.',
            },
        },
        {
            '@type': 'Question',
            name: 'How can I donate to an NGO in Mumbai?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'You can donate online to Mars Care Foundation at marscarefoundation.in/donate. We accept UPI, bank transfer, and online payment. Your donation is eligible for 80G tax exemption.',
            },
        },
        {
            '@type': 'Question',
            name: 'How can I volunteer with an NGO in Mumbai?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Visit marscarefoundation.in/volunteer to register as a volunteer. We welcome volunteers for education, healthcare, event management, and social media across Mumbai and Mira Road.',
            },
        },
        {
            '@type': 'Question',
            name: 'Is Mars Care Foundation a registered NGO?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, Mars Care Foundation is a registered NGO in India. Donations are eligible for 80G tax exemption under the Income Tax Act.',
            },
        },
        {
            '@type': 'Question',
            name: 'What does Mars Care Foundation do for children?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Mars Care Foundation runs child education programs including school support, scholarships, learning camps, and vocational training. We have educated 5,000+ children across Mumbai and rural Maharashtra.',
            },
        },
        {
            '@type': 'Question',
            name: 'Does Mars Care Foundation provide 80G tax exemption?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, donations made to Mars Care Foundation qualify for 80G tax deduction under the Indian Income Tax Act, making your contribution both impactful and tax-efficient.',
            },
        },
    ],
};

const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Mars Care Foundation',
    url: 'https://marscarefoundation.in',
    description: 'Official website of Mars Care Foundation — Best NGO in Mira Road, Mumbai. Caring for Humanity.',
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://marscarefoundation.in/programs?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
    },
};

const impactStats = [
    { icon: Users, value: 50000, label: 'Lives Impacted', suffix: '+' },
    { icon: GraduationCap, value: 5000, label: 'Children Educated', suffix: '+' },
    { icon: Stethoscope, value: 25000, label: 'Medical Treatments', suffix: '+' },
    { icon: Heart, value: 100, label: 'Villages Reached', suffix: '+' },
];

export default function HomePage() {
    const [featuredPrograms, setFeaturedPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            // Fetch all programs to ensure we have content to show
            const res = await programsApi.getAll({ limit: 3 });
            if (res.data.data && res.data.data.length > 0) {
                setFeaturedPrograms(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch programs', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* JSON-LD Structured Data — for Google rich results */}
            <JsonLd data={organizationSchema} />
            <JsonLd data={localBusinessSchema} />
            <JsonLd data={faqSchema} />
            <JsonLd data={websiteSchema} />

            {/* Hero Section */}
            <HeroSection />

            {/* Quick Donate Widget */}
            <section className="relative z-30 -mt-20 px-4">
                <div className="container-custom">
                    <DonationWidget />
                </div>
            </section>

            <ImpactStats />

            {/* Featured Programs */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
                    >
                        <div>
                            <span className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Our Missions</span>
                            <h2 className="font-playfair text-4xl md:text-6xl font-bold text-primary italic">
                                Strategic Impact
                            </h2>
                        </div>
                        <Link href="/programs" className="btn-secondary inline-flex items-center gap-2 w-fit text-sm">
                            View All Programs
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            // Loading skeleton
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="glass-card h-[450px] animate-pulse">
                                    <div className="h-56 bg-gray-200/20" />
                                    <div className="p-6 space-y-4">
                                        <div className="h-6 bg-gray-200/20 rounded w-3/4" />
                                        <div className="h-4 bg-gray-200/20 rounded w-full" />
                                        <div className="h-4 bg-gray-200/20 rounded w-2/3" />
                                    </div>
                                </div>
                            ))
                        ) : featuredPrograms.length > 0 ? (
                            featuredPrograms.map((program, index) => (
                                <ProgramCard key={program.slug || program._id} program={program} index={index} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                <p>No featured programs at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="bg-primary rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />


                        <div className="relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-8 italic">
                                    Ready to make a <br />human difference?
                                </h2>
                                <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12 font-outfit font-light leading-relaxed">
                                    Your contribution today can change a life forever. Join our community of radical kindness and sustainable impact.
                                </p>
                                <div className="flex flex-wrap justify-center gap-6">
                                    <Link href="/donate" className="px-12 py-5 bg-secondary text-white font-bold text-lg rounded-2xl hover:bg-white hover:text-primary transition-all shadow-2xl flex items-center gap-3 group">
                                        <Heart className="w-5 h-5 group-hover:scale-120 transition-transform" />
                                        Launch Donation
                                    </Link>
                                    <Link href="/volunteer" className="px-12 py-5 bg-white/5 backdrop-blur-xl border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all">
                                        Join as Volunteer
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <BlogSection />
        </>
    );
}
