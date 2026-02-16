'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, Award, CreditCard, Building2, Check, Loader2, ArrowRight, User, Mail, Phone, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { donationsApi, programsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import PageHero from '@/components/PageHero';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useRouter } from 'next/navigation';

const suggestedAmounts = [500, 1000, 2500, 5000, 10000, 25000];

export default function DonatePage() {
    const router = useRouter();
    const [amount, setAmount] = useState(1000);
    const [customAmount, setCustomAmount] = useState('');
    const [donationType, setDonationType] = useState('one-time');
    const [selectedProgram, setSelectedProgram] = useState('');
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const { width, height } = useWindowSize();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        panNumber: '',
        isAnonymous: false,
        dedicatedTo: '',
        message: '',
    });

    useEffect(() => {
        const init = async () => {
            try {
                const res = await programsApi.getAll({ status: 'active' });
                const loadedPrograms = res.data.data || [];
                setPrograms(loadedPrograms);

                const params = new URLSearchParams(window.location.search);
                const programParam = params.get('program');

                if (programParam && loadedPrograms.length > 0) {
                    const found = loadedPrograms.find(p => p._id === programParam || p.slug === programParam);
                    if (found) setSelectedProgram(found._id);
                }

                const amountParam = params.get('amount');
                if (amountParam) {
                    const val = parseInt(amountParam);
                    if (!isNaN(val)) setAmount(val);
                }

                const typeParam = params.get('type');
                if (typeParam && ['one-time', 'monthly'].includes(typeParam)) {
                    setDonationType(typeParam);
                }
            } catch (error) {
                console.error('Failed to load programs', error);
            }
        };
        init();
    }, []);

    const handleAmountSelect = (value) => {
        setAmount(value);
        setCustomAmount('');
    };

    const handleCustomAmount = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setCustomAmount(value);
        if (value) setAmount(parseInt(value));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!formData.name || !formData.email || !formData.phone) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (amount < 100) {
            toast.error('Minimum donation amount is ₹100');
            return;
        }

        setLoading(true);

        try {
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                toast.error('Failed to load payment gateway');
                setLoading(false);
                return;
            }

            const orderRes = await donationsApi.createOrder({
                amount,
                donorName: formData.name,
                donorEmail: formData.email,
                donorPhone: formData.phone,
                panNumber: formData.panNumber,
                programId: selectedProgram,
                type: donationType,
                isAnonymous: formData.isAnonymous,
                dedicatedTo: formData.dedicatedTo ? { name: formData.dedicatedTo, message: formData.message } : undefined
            });

            const { orderId, donationId, keyId } = orderRes.data.data;

            const options = {
                key: keyId,
                amount: amount * 100,
                currency: 'INR',
                name: 'Mars Care Foundation',
                description: `Donation${selectedProgram ? ' for ' + selectedProgram : ''}`,
                order_id: orderId,
                handler: async function (response) {
                    try {
                        await donationsApi.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            donationId
                        });
                        toast.success('Thank you for your donation! 🎉');
                        // Redirect to success page
                        router.push('/success');
                    } catch (error) {
                        toast.error('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: '#FF6B35'
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            toast.error('Failed to initiate payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            {step === 3 && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

            <PageHero
                image="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop"
                mobileImage="https://images.unsplash.com/photo-1542810634-7bc2c7ad3100?q=80&w=774&auto=format&fit=crop"
            />

            <section className="relative z-10 -mt-24 pb-32 overflow-hidden">
                {/* Atmospheric Depth */}
                <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.01] pointer-events-none" />
                <div className="absolute top-1/2 -right-48 w-[30rem] h-[30rem] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="container-custom relative z-10">
                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Main Interaction Hub */}
                        <div className="lg:col-span-8">
                            <div className="bg-white/70 backdrop-blur-3xl rounded-[3.5rem] shadow-2xl shadow-primary/5 border border-white overflow-hidden">
                                {/* Artistic Progress Header */}
                                {step < 3 && (
                                    <div className="p-8 pb-0 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {[1, 2].map((i) => (
                                                <div key={i} className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= i ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                                                        {i}
                                                    </div>
                                                    {i === 1 && (
                                                        <div className="w-16 h-[2px] bg-gray-100 relative overflow-hidden">
                                                            <div className={`absolute inset-0 bg-secondary transition-all duration-700 ease-out ${step >= 2 ? 'translate-x-0' : '-translate-x-full'}`} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
                                            Phase {step} of 2
                                        </div>
                                    </div>
                                )}

                                <div className="p-8 md:p-16 pt-12">
                                    <AnimatePresence mode='wait'>
                                        {step === 1 && (
                                            <motion.div
                                                key="step1"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                            >
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="w-8 h-[1px] bg-secondary" />
                                                    <span className="text-secondary font-bold tracking-[0.2em] uppercase text-[10px]">The Offering</span>
                                                </div>
                                                <h3 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-10 italic">Define Your Impact</h3>

                                                {/* Frequency Switcher */}
                                                <div className="inline-flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 mb-10">
                                                    <button
                                                        onClick={() => setDonationType('one-time')}
                                                        className={`px-8 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 ${donationType === 'one-time' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-primary'}`}
                                                    >
                                                        One-Time
                                                    </button>
                                                    <button
                                                        onClick={() => setDonationType('monthly')}
                                                        className={`px-8 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 ${donationType === 'monthly' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-primary'}`}
                                                    >
                                                        Monthly Pulse
                                                    </button>
                                                </div>

                                                {/* Amount Grid */}
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                                                    {suggestedAmounts.map((value) => (
                                                        <button
                                                            key={value}
                                                            onClick={() => handleAmountSelect(value)}
                                                            className={`py-5 px-4 rounded-3xl font-bold text-lg transition-all duration-300 border ${amount === value && !customAmount
                                                                ? 'border-secondary bg-secondary/5 text-secondary shadow-lg shadow-secondary/10'
                                                                : 'border-gray-50 bg-gray-50/50 text-gray-400 hover:bg-white hover:border-gray-200 hover:text-primary'
                                                                }`}
                                                        >
                                                            ₹{value.toLocaleString()}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Custom Amount */}
                                                <div className="mb-10 group">
                                                    <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase ml-1 mb-3 block">Specified Contribution</label>
                                                    <div className="relative">
                                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-xl">₹</span>
                                                        <input
                                                            type="text"
                                                            value={customAmount}
                                                            onChange={handleCustomAmount}
                                                            className="w-full pl-12 pr-8 py-5 bg-gray-50/50 border-none rounded-3xl font-bold text-xl text-primary focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-gray-200"
                                                            placeholder="Other Amount"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Cause Selection */}
                                                <div className="mb-12 p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                                        <Heart size={80} />
                                                    </div>
                                                    <label className="text-[10px] font-bold text-primary tracking-widest uppercase block mb-4">Dedicated Purpose</label>
                                                    <select
                                                        value={selectedProgram}
                                                        onChange={(e) => setSelectedProgram(e.target.value)}
                                                        className="w-full p-4 bg-white border border-primary/10 rounded-2xl text-primary font-medium focus:ring-2 focus:ring-secondary/20 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="">General Collective - Where needed most</option>
                                                        {programs.map((program) => (
                                                            <option key={program._id} value={program._id}>
                                                                {program.title}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <button
                                                    onClick={() => setStep(2)}
                                                    className="w-full bg-primary text-white py-5 text-lg font-bold rounded-2xl flex items-center justify-center gap-3 group transition-all hover:bg-secondary shadow-xl hover:shadow-secondary/20 active:scale-[0.98]"
                                                >
                                                    Next Intent
                                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </motion.div>
                                        )}

                                        {step === 2 && (
                                            <motion.div
                                                key="step2"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                            >
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="w-8 h-[1px] bg-secondary" />
                                                    <span className="text-secondary font-bold tracking-[0.2em] uppercase text-[10px]">Verification</span>
                                                </div>
                                                <h3 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-10 italic">Personal Identity</h3>

                                                <div className="space-y-6 mb-10">
                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase ml-1">Identity</label>
                                                            <div className="relative">
                                                                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    placeholder="Full Name *"
                                                                    value={formData.name}
                                                                    onChange={handleInputChange}
                                                                    className="w-full pl-14 pr-6 py-4 bg-gray-50/50 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase ml-1">Digital Reach</label>
                                                            <div className="relative">
                                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                                                <input
                                                                    type="email"
                                                                    name="email"
                                                                    placeholder="Email Address *"
                                                                    value={formData.email}
                                                                    onChange={handleInputChange}
                                                                    className="w-full pl-14 pr-6 py-4 bg-gray-50/50 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase ml-1">Pulse</label>
                                                            <div className="relative">
                                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                                                <input
                                                                    type="tel"
                                                                    name="phone"
                                                                    placeholder="Phone Number *"
                                                                    value={formData.phone}
                                                                    onChange={handleInputChange}
                                                                    className="w-full pl-14 pr-6 py-4 bg-gray-50/50 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase ml-1">Fiscal Registry</label>
                                                            <div className="relative">
                                                                <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                                                <input
                                                                    type="text"
                                                                    name="panNumber"
                                                                    placeholder="PAN (optional for 80G)"
                                                                    value={formData.panNumber}
                                                                    onChange={handleInputChange}
                                                                    className="w-full pl-14 pr-6 py-4 bg-gray-50/50 rounded-2xl border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium uppercase"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-10">
                                                    <label className="flex items-center gap-4 p-6 bg-white border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all">
                                                        <div className="relative flex items-center justify-center">
                                                            <input
                                                                type="checkbox"
                                                                name="isAnonymous"
                                                                checked={formData.isAnonymous}
                                                                onChange={handleInputChange}
                                                                className="w-6 h-6 rounded-lg text-secondary border-gray-200 focus:ring-secondary/20 cursor-pointer"
                                                            />
                                                        </div>
                                                        <span className="text-primary font-bold text-sm tracking-wide">Shield Identity (Donate Anonymously)</span>
                                                    </label>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <button
                                                        onClick={() => setStep(1)}
                                                        className="px-10 py-5 rounded-2xl font-bold border border-gray-200 text-gray-400 hover:text-primary hover:bg-gray-50 transition-all"
                                                    >
                                                        Review Amount
                                                    </button>
                                                    <button
                                                        onClick={handlePayment}
                                                        disabled={loading}
                                                        className="flex-1 bg-primary text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:bg-secondary transition-all active:scale-[0.98] disabled:opacity-50"
                                                    >
                                                        {loading ? (
                                                            <Loader2 className="w-6 h-6 animate-spin" />
                                                        ) : (
                                                            <>
                                                                Initiate {formatCurrency(amount)}
                                                                <ArrowRight size={20} />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {step === 3 && (
                                            <motion.div
                                                key="step3"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-center py-12"
                                            >
                                                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-10 border border-green-100">
                                                    <Check className="w-12 h-12 text-green-500" />
                                                </div>
                                                <h2 className="font-playfair text-5xl font-bold text-primary mb-6">Gratitude</h2>
                                                <p className="text-gray-500 text-lg font-outfit font-light mb-12 max-w-xl mx-auto leading-relaxed">
                                                    Your contribution of <span className="text-secondary font-bold">{formatCurrency(amount)}</span> has been received. You are now part of the Mars Care legacy.
                                                </p>
                                                <div className="flex justify-center gap-6">
                                                    <a href="/" className="px-12 py-4 bg-primary text-white font-bold text-sm rounded-full hover:bg-secondary transition-all shadow-lg hover:shadow-secondary/20">
                                                        Home
                                                    </a>
                                                    <Link href="/programs" className="px-12 py-4 bg-white border border-gray-100 text-primary font-bold text-sm rounded-full hover:bg-gray-50 transition-all shadow-sm">
                                                        Explore Impact
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Summary & Trust Sidebar */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* The Summary Card */}
                            <div className="bg-white/70 backdrop-blur-3xl rounded-[3rem] p-10 shadow-2xl shadow-primary/5 border border-white">
                                <h4 className="font-playfair text-2xl font-bold text-primary mb-8 flex items-center gap-3 italic">
                                    <CreditCard className="w-6 h-6 text-secondary" /> Ledger
                                </h4>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center group">
                                        <span className="text-[10px] font-bold text-gray-300 tracking-[0.2em] uppercase">Commitment</span>
                                        <span className="font-outfit font-bold text-primary">{formatCurrency(amount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center group">
                                        <span className="text-[10px] font-bold text-gray-300 tracking-[0.2em] uppercase">Rhythm</span>
                                        <span className="font-outfit font-bold text-primary capitalize">{donationType}</span>
                                    </div>
                                    {selectedProgram && (
                                        <div className="flex flex-col gap-2 pt-2">
                                            <span className="text-[10px] font-bold text-gray-300 tracking-[0.2em] uppercase">Designated To</span>
                                            <span className="font-outfit font-bold text-primary text-sm leading-relaxed">
                                                {programs.find(p => p._id === selectedProgram)?.title || 'General Impact'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
                                        <span className="font-playfair text-xl font-bold text-secondary">Total Ledger</span>
                                        <span className="font-outfit text-2xl font-bold text-primary">{formatCurrency(amount)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust & Identity Badges */}
                            <div className="bg-[#0A1A2F] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-[80px] pointer-events-none -mr-20 -mt-20 group-hover:bg-secondary/20 transition-all duration-700" />

                                <h4 className="font-playfair text-2xl font-bold mb-8 italic">Secure Impact</h4>
                                <div className="space-y-8">
                                    <div className="flex gap-5 group/item">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 transition-transform group-hover/item:scale-110">
                                            <Shield className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm tracking-wide">Razorpay Secure</p>
                                            <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase mt-1">Encrypted Payment</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5 group/item">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 transition-transform group-hover/item:scale-110">
                                            <Award className="w-5 h-5 text-secondary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm tracking-wide">80G Tax Relief</p>
                                            <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase mt-1">Fiscal Benefit</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5 group/item">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 transition-transform group-hover/item:scale-110">
                                            <Building2 className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm tracking-wide">Radical Transparency</p>
                                            <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase mt-1">Impact Reporting</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
