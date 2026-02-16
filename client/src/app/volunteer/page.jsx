'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Users, Heart, Clock, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { volunteersApi } from '@/lib/api';
import PageHero from '@/components/PageHero';

const skills = [
    { value: 'teaching', label: 'Teaching & Education' },
    { value: 'medical', label: 'Medical & Healthcare' },
    { value: 'counseling', label: 'Counseling' },
    { value: 'event-management', label: 'Event Management' },
    { value: 'photography', label: 'Photography & Videography' },
    { value: 'social-media', label: 'Social Media & Marketing' },
    { value: 'fundraising', label: 'Fundraising' },
    { value: 'logistics', label: 'Logistics & Operations' },
    { value: 'administration', label: 'Administration' },
    { value: 'legal', label: 'Legal' },
    { value: 'technology', label: 'Technology & IT' },
    { value: 'content-writing', label: 'Content Writing' },
    { value: 'translation', label: 'Translation' },
    { value: 'driving', label: 'Driving' },
    { value: 'other', label: 'Other' },
];

const benefits = [
    'Make a real difference in people\'s lives',
    'Gain valuable experience and skills',
    'Network with like-minded individuals',
    'Receive volunteer certificates',
    'Flexible timing options',
    'Be part of a caring community',
];

export default function VolunteerPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const toggleSkill = (skill) => {
        setSelectedSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    };

    const onSubmit = async (data) => {
        if (selectedSkills.length === 0) {
            toast.error('Please select at least one skill');
            return;
        }

        setLoading(true);
        try {
            await volunteersApi.register({
                ...data,
                skills: selectedSkills
            });
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            toast.success('Registration submitted successfully!');
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to submit. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center bg-[#FDFBF7]">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[3rem] p-16 text-center shadow-2xl shadow-primary/5 border border-gray-100 max-w-2xl mx-auto"
                    >
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                        <h2 className="font-playfair text-4xl font-bold text-primary mb-4">
                            Registry Successful! 🎉
                        </h2>
                        <p className="text-gray-500 text-lg font-outfit font-light mb-10">
                            Thank you for your interest in volunteering with Mars Care Foundation. <br />
                            Our team will review your application and get in touch with you shortly.
                        </p>
                        <a href="/" className="px-12 py-4 bg-primary text-white font-bold text-sm rounded-full hover:bg-secondary transition-all shadow-lg hover:shadow-secondary/20 inline-flex items-center gap-2">
                            <Heart className="w-5 h-5 fill-current" />
                            Back to Home
                        </a>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <PageHero
                image="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop"
                mobileImage="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1740&auto=format&fit=crop"
            />

            <section className="py-24 relative overflow-hidden">
                {/* Atmospheric Depth */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/[0.01] pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="container-custom relative z-10">
                    <div className="grid lg:grid-cols-3 gap-16">
                        {/* Benefits & Impact Sidebar */}
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-[1px] bg-secondary" />
                                    <span className="text-secondary font-bold tracking-[0.2em] uppercase text-xs">The Calling</span>
                                </div>
                                <h2 className="font-playfair text-4xl font-bold text-primary leading-tight italic">Why Your Voice Matters</h2>
                                <p className="text-gray-500 font-outfit font-light leading-relaxed">
                                    Every hour you contribute is a ripple of change in a child's life. Join a collective of humans dedicated to radical kindness.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {benefits.map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-4 group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                                            <CheckCircle size={20} />
                                        </div>
                                        <span className="text-primary font-bold text-sm tracking-wide">{benefit}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="p-10 bg-primary/5 rounded-[2.5rem] border border-primary/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Clock size={80} />
                                </div>
                                <h3 className="font-playfair text-2xl font-bold text-primary mb-4">Commitment</h3>
                                <p className="text-gray-500 text-sm font-outfit mb-6">We value your time. Our missions are flexible yet impactful.</p>
                                <div className="space-y-3 font-bold text-xs uppercase tracking-widest text-[#1A3C5A]">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-secondary" />
                                        <span>4+ Hours / Week</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-secondary" />
                                        <span>Hybrid / Remote</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Glassmorphic Registration Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-2"
                        >
                            <div className="bg-white/70 backdrop-blur-3xl rounded-[3.5rem] p-8 md:p-16 shadow-2xl shadow-primary/5 border border-white relative overflow-hidden">
                                <h2 className="font-playfair text-4xl font-bold text-primary mb-12">Registry of Intent</h2>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase ml-1">Identity</label>
                                            <input
                                                {...register('name', { required: 'Name is required' })}
                                                type="text"
                                                placeholder="Full Name *"
                                                className={`w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium ${errors.name ? 'ring-2 ring-red-200' : ''}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase ml-1">Communication</label>
                                            <input
                                                {...register('email', {
                                                    required: 'Email is required',
                                                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                                                })}
                                                type="email"
                                                placeholder="Email Address *"
                                                className={`w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium ${errors.email ? 'ring-2 ring-red-200' : ''}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase ml-1">Pulse</label>
                                            <input
                                                {...register('phone', { required: 'Phone is required' })}
                                                type="tel"
                                                placeholder="Phone Number *"
                                                className={`w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium ${errors.phone ? 'ring-2 ring-red-200' : ''}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase ml-1">Current Role</label>
                                            <input
                                                {...register('occupation')}
                                                type="text"
                                                placeholder="Occupation"
                                                className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase ml-1">Availability Window</label>
                                        <select
                                            {...register('availability')}
                                            className="w-full px-6 py-4 bg-gray-50/50 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium appearance-none"
                                            defaultValue="flexible"
                                        >
                                            <option value="weekdays">Weekdays</option>
                                            <option value="weekends">Weekends</option>
                                            <option value="both">Both Weekdays & Weekends</option>
                                            <option value="flexible">Flexible Timing</option>
                                        </select>
                                    </div>

                                    {/* Skills Selection */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase ml-1">Versatile Skills *</label>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map((skill) => (
                                                <button
                                                    key={skill.value}
                                                    type="button"
                                                    onClick={() => toggleSkill(skill.value)}
                                                    className={`px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${selectedSkills.includes(skill.value)
                                                        ? 'bg-secondary text-white shadow-lg shadow-secondary/30'
                                                        : 'bg-white text-gray-400 hover:text-primary hover:bg-gray-50 border border-gray-100'
                                                        }`}
                                                >
                                                    {skill.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase ml-1">Core Motivation</label>
                                        <textarea
                                            {...register('motivation')}
                                            rows={4}
                                            placeholder="Why do you wish to join Mars Care? Share your journey..."
                                            className="w-full px-8 py-6 bg-gray-50/50 rounded-[2rem] border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium resize-none leading-relaxed"
                                        />
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-5 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-secondary transition-all shadow-xl hover:shadow-secondary/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <>
                                                    <Heart size={20} className="fill-current group-hover:scale-120 transition-transform" />
                                                    Submit Initial Intent
                                                </>
                                            )}
                                        </button>
                                        <p className="mt-6 text-center text-[10px] text-gray-300 font-bold tracking-[0.3em] uppercase">
                                            Community First • Radical Kindness • Sustainable Impact
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
