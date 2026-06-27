'use client';

import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#F9F7F4]">
            <PageHero
                image="https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=2070"
                height="h-[35vh]"
            />
            
            <section className="section-padding relative overflow-hidden -mt-20">
                {/* Decorative background elements matching original design */}
                <div className="absolute top-20 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="container-custom max-w-4xl bg-white rounded-[2rem] p-8 md:p-16 border border-gray-100 shadow-xl relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-8 h-[2px] bg-[#F4A261]" />
                        <span className="text-[#F4A261] font-bold tracking-[0.2em] uppercase text-[10px]">Agreement</span>
                    </div>
                    
                    <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#1A3C5A] mb-8">Terms of Service</h1>
                    
                    <div className="prose prose-blue max-w-none text-[#2D3748] font-outfit space-y-8 leading-relaxed">
                        <p className="text-gray-500 font-light text-base md:text-lg">
                            Welcome to Mars Care Foundation. By accessing our website, subscribing to our newsletters, or donating to our causes, you agree to comply with and be bound by the following terms and conditions of use.
                        </p>
                        
                        <div className="border-t pt-8">
                            <h2 className="text-xl font-bold text-[#1A3C5A] mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-600 font-light text-sm md:text-base">
                                The services offered by Mars Care Foundation are subject to these Terms of Service. We reserve the right to update these terms at any time without notice. Your continued use of the website following any changes constitutes acceptance of those changes.
                            </p>
                        </div>

                        <div className="border-t pt-8">
                            <h2 className="text-xl font-bold text-[#1A3C5A] mb-4">2. Voluntary Donations</h2>
                            <p className="text-gray-600 font-light text-sm md:text-base">
                                All donations made through the Mars Care Foundation platform are voluntary and non-refundable, except as outlined in our Refund Policy. Donors are requested to provide accurate personal credentials and PAN Card details if they wish to receive tax exemption certificates under Section 80G.
                            </p>
                        </div>

                        <div className="border-t pt-8">
                            <h2 className="text-xl font-bold text-[#1A3C5A] mb-4">3. Refund and Cancellation</h2>
                            <p className="text-gray-600 font-light text-sm md:text-base">
                                Because donations are allocated to support ongoing healthcare, child education, and emergency community development programs, we do not generally offer cancellations or refunds. In exceptional circumstances, such as unauthorized card usage or duplicate billing, refund requests can be submitted via email to <a href="mailto:info@marscarefoundation.org" className="text-[#F4A261] font-semibold hover:underline">info@marscarefoundation.org</a> within 7 business days of the transaction.
                            </p>
                        </div>

                        <div className="border-t pt-8">
                            <h2 className="text-xl font-bold text-[#1A3C5A] mb-4">4. Intellectual Property</h2>
                            <p className="text-gray-600 font-light text-sm md:text-base">
                                The design, layout, graphics, logo, and textual content of this website are owned by or licensed to Mars Care Foundation. Reproduction of any material from this site without prior written consent is strictly prohibited.
                            </p>
                        </div>

                        <div className="border-t pt-8">
                            <h2 className="text-xl font-bold text-[#1A3C5A] mb-4">5. Governing Law</h2>
                            <p className="text-gray-600 font-light text-sm md:text-base">
                                These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Thane/Mumbai, Maharashtra.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
