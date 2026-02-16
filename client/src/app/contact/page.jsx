'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Send, MapPin, Phone, Mail, Clock, MessageSquare, Loader2 } from 'lucide-react';
import { contactApi } from '@/lib/api';
import PageHero from '@/components/PageHero';

const contactInfo = [
    {
        icon: MapPin,
        title: 'Our Office',
        content: '123 NGO Street, Mumbai, Maharashtra, India - 400001',
    },
    {
        icon: Phone,
        title: 'Phone',
        content: '+91 98765 43210',
        link: 'tel:+919876543210',
    },
    {
        icon: Mail,
        title: 'Email',
        content: 'info@marscarefoundation.org',
        link: 'mailto:info@marscarefoundation.org',
    },
    {
        icon: Clock,
        title: 'Working Hours',
        content: 'Mon - Sat: 9:00 AM - 6:00 PM',
    },
];

const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'partnership', label: 'Partnership Opportunity' },
    { value: 'media', label: 'Media & Press' },
    { value: 'donation-query', label: 'Donation Query' },
    { value: 'volunteer-query', label: 'Volunteer Query' },
    { value: 'other', label: 'Other' },
];

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await contactApi.submit(data);
            toast.success('Message sent successfully! We will get back to you soon.');
            reset();
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <PageHero
                image="https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=2070&auto=format&fit=crop"
                mobileImage="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1740&auto=format&fit=crop"
            />

            <div className="container-custom py-16">

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        {contactInfo.map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mars-orange to-mars-red flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                                        {item.link ? (
                                            <a href={item.link} className="text-gray-600 hover:text-mars-orange transition-colors">
                                                {item.content}
                                            </a>
                                        ) : (
                                            <p className="text-gray-600">{item.content}</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Map Placeholder */}
                        <div className="bg-white rounded-2xl p-6 h-64 flex items-center justify-center text-gray-400 border border-gray-100">
                            <p>Google Maps Integration</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mars-orange to-mars-red flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="font-heading text-2xl font-bold text-gray-900">Send us a Message</h2>
                                <p className="text-gray-500">We'll get back to you within 24 hours</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        {...register('name', { required: 'Name is required' })}
                                        type="text"
                                        placeholder="Your Name *"
                                        className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                                    />
                                    {errors.name && <p className="mt-1 text-red-400 text-sm">{errors.name.message}</p>}
                                </div>
                                <div>
                                    <input
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                                        })}
                                        type="email"
                                        placeholder="Email Address *"
                                        className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                                    />
                                    {errors.email && <p className="mt-1 text-red-400 text-sm">{errors.email.message}</p>}
                                </div>
                                <div>
                                    <input
                                        {...register('phone')}
                                        type="tel"
                                        placeholder="Phone Number"
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <select
                                        {...register('type')}
                                        className="input-field"
                                        defaultValue="general"
                                    >
                                        {inquiryTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <input
                                    {...register('subject', { required: 'Subject is required' })}
                                    type="text"
                                    placeholder="Subject *"
                                    className={`input-field ${errors.subject ? 'border-red-500' : ''}`}
                                />
                                {errors.subject && <p className="mt-1 text-red-400 text-sm">{errors.subject.message}</p>}
                            </div>

                            <div>
                                <textarea
                                    {...register('message', { required: 'Message is required' })}
                                    rows={6}
                                    placeholder="Your Message *"
                                    className={`input-field resize-none ${errors.message ? 'border-red-500' : ''}`}
                                />
                                {errors.message && <p className="mt-1 text-red-400 text-sm">{errors.message.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
