'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Target, Eye, Users, Award, ShieldCheck } from 'lucide-react';
import PageHero from '@/components/PageHero';

const values = [
    {
        icon: Heart,
        title: 'Compassion',
        description: 'We believe in serving with empathy and kindness, putting humanity at the heart of everything we do.'
    },
    {
        icon: Target,
        title: 'Integrity',
        description: 'Transparency and accountability are the foundations of our work. We ensure every donation reaches those in need.'
    },
    {
        icon: Award,
        title: 'Excellence',
        description: 'We strive for the highest quality in our programs, ensuring sustainable and long-lasting impact.'
    },
    {
        icon: ShieldCheck,
        title: 'Empowerment',
        description: 'We don\'t just provide aid; we empower communities to become self-reliant and build their own futures.'
    }
];

const team = [
    {
        name: 'Dr. Sarah Mitchell',
        role: 'Founder & Chairperson',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
        bio: 'With 20 years of experience in social work, Dr. Mitchell founded Mars Care to bridge the gap in rural healthcare.'
    },
    {
        name: 'Rajesh Kumar',
        role: 'Executive Director',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        bio: 'Rajesh leads our ground operations and ensures that our education initiatives are implemented effectively.'
    },
    {
        name: 'Anjali Sharma',
        role: 'Head of Women Empowerment',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
        bio: 'Anjali is passionate about vocational training and has helped over 1000 women start their own small businesses.'
    }
];

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            <PageHero
                image="https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2074&auto=format&fit=crop"
                mobileImage="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1740&auto=format&fit=crop"
            />

            <section className="section-padding relative overflow-hidden bg-white">
                {/* Atmospheric Depth */}
                <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.01] pointer-events-none" />
                <div className="absolute top-20 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="container-custom relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-12 h-[2px] bg-secondary" />
                                <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">Our Genesis</span>
                            </div>
                            <h2 className="font-playfair text-5xl md:text-7xl font-bold text-primary mt-2 mb-8 leading-[1.1]">
                                Empowering Communities, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">Transforming Lives</span>
                            </h2>
                            <p className="font-outfit text-xl text-gray-500 mb-10 leading-relaxed font-light">
                                Mars Care Foundation is a human-centric organization dedicated to creating a world where every individual has access to quality education, essential healthcare, and equal opportunities.
                            </p>

                            <div className="flex gap-8">
                                <div className="relative group">
                                    <div className="absolute -inset-2 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                                        <h3 className="text-4xl font-bold text-primary mb-1">50k+</h3>
                                        <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Lives Impacted</p>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="absolute -inset-2 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                                        <h3 className="text-4xl font-bold text-secondary mb-1">100+</h3>
                                        <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Villages Reached</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="relative"
                        >
                            <div className="relative h-[500px] md:h-[650px] rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
                                <Image
                                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800"
                                    alt="About Mars Care"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                            </div>

                            {/* Decorative Floating Icon */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-secondary/40"
                            >
                                <Heart className="w-16 h-16 text-white" />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="section-padding bg-[#0A1A2F] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/5 rotate-12 transform translate-x-1/2" />

                <div className="container-custom relative z-10">
                    <div className="grid md:grid-cols-2 gap-10">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white/5 backdrop-blur-xl p-12 rounded-[2.5rem] border border-white/10 group transition-all duration-500"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center mb-8 border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
                                <Target className="w-10 h-10 text-secondary" />
                            </div>
                            <h2 className="font-playfair text-4xl font-bold text-white mb-6">Our Mission</h2>
                            <p className="text-white/60 leading-relaxed text-lg font-outfit font-light">
                                To improve the quality of life for underprivileged communities in India by providing access to health, education, and sustainable livelihood programs that empower individuals to reach their full potential.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white/5 backdrop-blur-xl p-12 rounded-[2.5rem] border border-white/10 group transition-all duration-500"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-white/10 transition-colors">
                                <Eye className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="font-playfair text-4xl font-bold text-white mb-6">Our Vision</h2>
                            <p className="text-white/60 leading-relaxed text-lg font-outfit font-light">
                                A society where every person lives with dignity, health, and security, and where the most vulnerable populations are empowered to drive their own development and create a brighter future.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section-padding bg-white relative">
                <div className="container-custom text-center mb-24">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="w-8 h-[1px] bg-secondary" />
                        <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">What Drives Us</span>
                    </div>
                    <h2 className="font-playfair text-5xl md:text-6xl font-bold text-primary">Our Core Values</h2>
                </div>

                <div className="container-custom grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {values.map((value, index) => (
                        <motion.div
                            key={value.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="group p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 text-center"
                        >
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-primary transition-all duration-500">
                                <value.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-playfair text-2xl font-bold text-primary mb-4">{value.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed font-outfit">{value.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Leadership Team */}
            <section className="section-padding bg-white relative overflow-hidden">
                <div className="container-custom text-center mb-24">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="w-8 h-[1px] bg-secondary" />
                        <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">The Visionaries</span>
                    </div>
                    <h2 className="font-playfair text-5xl md:text-6xl font-bold text-primary">Leadership Team</h2>
                </div>

                <div className="container-custom grid md:grid-cols-3 gap-12">
                    {team.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.8 }}
                            className="group"
                        >
                            <div className="relative h-[450px] rounded-[3rem] overflow-hidden mb-8 shadow-2xl">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                <div className="absolute bottom-10 left-10 right-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="font-playfair text-2xl font-bold text-white mb-2">{member.name}</h3>
                                    <p className="text-secondary text-sm font-bold tracking-widest uppercase mb-4">{member.role}</p>
                                </div>
                            </div>
                            <div className="px-4">
                                <p className="text-gray-500 text-sm leading-relaxed font-outfit text-center italic">
                                    "{member.bio}"
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    )
}
