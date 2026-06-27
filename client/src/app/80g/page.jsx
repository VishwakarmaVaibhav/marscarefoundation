'use client';

import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Download, Award, FileCheck, HelpCircle, CheckCircle2 } from 'lucide-react';
import PageHero from '@/components/PageHero';

export default function TaxExemptionPage() {
    return (
        <div className="min-h-screen bg-[#F9F7F4]">
            <PageHero
                image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070"
                height="h-[40vh]"
            />
            
            <section className="section-padding relative overflow-hidden -mt-24">
                {/* Decorative background elements matching original design */}
                <div className="absolute top-20 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="container-custom max-w-4xl bg-white rounded-[2rem] p-8 md:p-16 border border-gray-100 shadow-xl relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-8 h-[2px] bg-[#F4A261]" />
                        <span className="text-[#F4A261] font-bold tracking-[0.2em] uppercase text-[10px]">Tax Benefits</span>
                    </div>
                    
                    <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#1A3C5A] mb-8">80G Tax Exemption</h1>
                    
                    <div className="prose prose-blue max-w-none text-[#2D3748] font-outfit space-y-8 leading-relaxed">
                        <p className="text-gray-500 font-light text-base md:text-lg">
                            Mars Care Foundation is a registered charitable trust in India. Under Section **80G of the Income Tax Act, 1961**, all donations made to our foundation are eligible for 50% tax exemption, allowing you to maximize the impact of your generosity.
                        </p>
                        
                        {/* Highlights Grid */}
                        <div className="grid md:grid-cols-2 gap-6 my-10">
                            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-4">
                                <div className="p-3 bg-[#1A3C5A]/10 rounded-xl flex-shrink-0">
                                    <Award className="w-6 h-6 text-[#1A3C5A]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-[#1A3C5A] mb-1">50% Tax Deduction</h3>
                                    <p className="text-sm text-gray-500 leading-normal">Fifty percent of your donated contribution is fully deductible from your taxable income under Section 80G.</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-4">
                                <div className="p-3 bg-[#F4A261]/10 rounded-xl flex-shrink-0">
                                    <ShieldCheck className="w-6 h-6 text-[#F4A261]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-[#1A3C5A] mb-1">Government Approved</h3>
                                    <p className="text-sm text-gray-500 leading-normal">Mars Care Foundation holds active registration with the Income Tax Department of India for offering exemption certificates.</p>
                                </div>
                            </div>
                        </div>

                        {/* Certificate Box */}
                        <div className="p-8 md:p-12 rounded-[2rem] bg-[#0A1A2F] text-white border border-white/10 relative overflow-hidden group my-12">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-[#F4A261]/10 rounded-full blur-[80px] pointer-events-none -mr-16 -mt-16" />
                            
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <FileCheck className="w-5 h-5 text-[#F4A261]" />
                                        <span className="text-[10px] font-bold text-white/50 tracking-widest uppercase">Official Certification</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-playfair font-bold text-white leading-tight">80G Certificate Approval</h3>
                                    
                                    <div className="space-y-2 text-sm text-white/70">
                                        <p><strong className="text-white font-medium">Organization:</strong> Mars Care Foundation</p>
                                        <p><strong className="text-white font-medium">Registered Office:</strong> Thane West, Maharashtra, India</p>
                                        <p><strong className="text-white font-medium">Approval URN:</strong> AAFTM0000AF20241 (Representative)</p>
                                        <p><strong className="text-white font-medium">Registration Status:</strong> Active & Eligible</p>
                                    </div>
                                </div>
                                
                                <div className="flex-shrink-0">
                                    <a
                                        href="/80G_Certificate_Placeholder.pdf"
                                        download
                                        onClick={(e) => {
                                            e.preventDefault();
                                            alert("Your 80G Certificate will download here. (Currently static placeholder file)");
                                        }}
                                        className="inline-flex items-center gap-2 bg-[#F4A261] text-white font-bold text-sm px-8 py-4 rounded-full hover:bg-white hover:text-[#1A3C5A] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download 80G Certificate
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* FAQs Section */}
                        <div className="border-t pt-10">
                            <h2 className="font-playfair text-2xl font-bold text-[#1A3C5A] mb-8 flex items-center gap-2">
                                <HelpCircle className="w-6 h-6 text-[#F4A261] flex-shrink-0" />
                                Frequently Asked Questions
                            </h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-[#1A3C5A] text-base md:text-lg mb-2">How do I claim my 80G tax exemption?</h3>
                                    <p className="text-gray-600 font-light text-sm md:text-base">
                                        When filing your Income Tax Return (ITR), enter the name of Mars Care Foundation, our registration URN, and the exact donated amount in Schedule 80G. You will also receive an official donation receipt from us.
                                    </p>
                                </div>
                                
                                <div className="border-t pt-6">
                                    <h3 className="font-bold text-[#1A3C5A] text-base md:text-lg mb-2">Why do you require my PAN Card details?</h3>
                                    <p className="text-gray-600 font-light text-sm md:text-base">
                                        Per regulations issued by the Central Board of Direct Taxes (CBDT), all NGOs must upload details of received donations (including donor PAN cards) to the Income Tax portal via Form 10BD. Without a valid PAN number, the tax deduction will not reflect on your Form 26AS/AIS.
                                    </p>
                                </div>
                                
                                <div className="border-t pt-6">
                                    <h3 className="font-bold text-[#1A3C5A] text-base md:text-lg mb-2">When will I receive my 80G tax certificate?</h3>
                                    <p className="text-gray-600 font-light text-sm md:text-base">
                                        Receipts for individual donations are sent via email within 24 hours of successful transactions. The consolidated Form 10BE tax exemption certificate for the financial year is uploaded and sent in May/June of the subsequent financial year.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
