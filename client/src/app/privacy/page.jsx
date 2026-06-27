'use client';

import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#F9F7F4]">
            <PageHero
                image="https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=2070"
                height="h-[35vh]"
            />
            
            <section className="section-padding relative overflow-hidden -mt-20">
                {/* Decorative background elements matching original design */}
                <div className="absolute top-20 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="container-custom max-w-4xl bg-white rounded-[2rem] p-8 md:p-16 border border-gray-100 shadow-xl relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-8 h-[2px] bg-[#F4A261]" />
                        <span className="text-[#F4A261] font-bold tracking-[0.2em] uppercase text-[10px]">Security</span>
                    </div>
                    
                    <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#1A3C5A] mb-8">Privacy Policy</h1>
                    
                    <div className="prose prose-blue max-w-none text-[#2D3748] font-outfit space-y-8 leading-relaxed">
                        <p className="text-gray-500 font-light text-base md:text-lg">
                            At Mars Care Foundation, we prioritize the protection and security of your personal data. This Privacy Policy outlines what information we collect and how we utilize it to support our mission.
                        </p>
                        
                        <div className="border-t pt-8">
                            <h2 className="text-xl font-bold text-[#1A3C5A] mb-4">1. Information We Collect</h2>
                            <p className="text-gray-600 font-light text-sm md:text-base mb-4">
                                We gather information directly from you when you interact with our website. This includes operations like making a donation, subscribing to newsletters, signing up to volunteer, or filling out contact forms:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 font-light text-sm md:text-base space-y-2">
                                <li><strong>Identity Data:</strong> Full name, age, and occupation (for volunteer profiles).</li>
                                <li><strong>Contact Data:</strong> Email address, phone number, and mailing address.</li>
                                <li><strong>Tax Verification Data:</strong> Permanent Account Number (PAN) Card details, which are legally required under Indian tax laws to register and issue tax-exemption receipts (Form 10BD/80G certificates).</li>
                                <li><strong>Transaction Data:</strong> Details of payments made through our secure payment gateway partner. We do not store or process card numbers, CVVs, or internet banking passwords on our servers.</li>
                            </ul>
                        </div>

                        <div className="border-t pt-8">
                            <h2 className="text-xl font-bold text-[#1A3C5A] mb-4">2. How We Use Your Data</h2>
                            <p className="text-gray-600 font-light text-sm md:text-base">
                                Mars Care Foundation uses your personal information strictly to process transactions, issue official 80G tax certificates, respond to inquiries, send newsletter campaigns, and share impact reports. We do not sell, license, trade, or share your personal data with third-party marketers or brokers.
                            </p>
                        </div>

                        <div className="border-t pt-8">
                            <h2 className="text-xl font-bold text-[#1A3C5A] mb-4">3. Security Measures</h2>
                            <p className="text-gray-600 font-light text-sm md:text-base">
                                We implement advanced physical, technical, and administrative security configurations to protect your personal details from unauthorized access, loss, or manipulation. Online donation checkout forms are encrypted using Secure Socket Layer (SSL) protocols and processed directly through Razorpay's PCI-DSS compliant secure servers.
                            </p>
                        </div>

                        <div className="border-t pt-8">
                            <h2 className="text-xl font-bold text-[#1A3C5A] mb-4">4. Cookies</h2>
                            <p className="text-gray-600 font-light text-sm md:text-base">
                                Our website uses cookies to enhance user navigation and analyze traffic patterns. You can choose to disable cookies in your browser settings, though doing so may limit access to some parts of our platform.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
