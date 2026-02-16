import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gift, Calendar, ArrowRight, Sparkles, ChevronDown, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { programsApi } from '@/lib/api';

const suggestedAmounts = [500, 1000, 2500, 5000];

export default function DonationWidget() {
    const router = useRouter();
    const [amount, setAmount] = useState(1000);
    const [donationType, setDonationType] = useState('one-time');
    const [customAmount, setCustomAmount] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('');
    const [programs, setPrograms] = useState([]);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const res = await programsApi.getAll({ status: 'active' });
                if (res.data.data) {
                    setPrograms(res.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch programs for widget', error);
            }
        };
        fetchPrograms();
    }, []);

    const handleAmountSelect = (value) => {
        setAmount(value);
        setCustomAmount('');
    };

    const handleCustomAmount = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setCustomAmount(value);
        if (value) {
            setAmount(parseInt(value));
        }
    };

    const handleDonate = () => {
        const queryParams = new URLSearchParams({
            amount: amount.toString(),
            type: donationType
        });
        if (selectedProgram) {
            queryParams.append('program', selectedProgram);
        }
        router.push(`/donate?${queryParams.toString()}`);
    };

    const getImpactMessage = (val) => {
        if (val >= 5000) return "Educates a child for a year";
        if (val >= 2500) return "Medical checkups for 5 families";
        if (val >= 1000) return "Feeds 20 homeless people";
        return "Provides essential supplies";
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-primary/10 border border-white/40 p-6 md:p-8 lg:p-10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12">

                {/* Left Side - Content & Selection */}
                <div className="lg:col-span-7 space-y-8 flex flex-col justify-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-secondary/10 to-primary/5 text-secondary text-xs font-bold uppercase tracking-wider mb-5 border border-secondary/10">
                            <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
                            Make a Difference
                        </div>
                        <h3 className="font-playfair text-4xl md:text-5xl font-bold text-primary leading-[1.1] italic">
                            Kindness is the<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-orange-400 to-primary">Universal Language</span>
                        </h3>
                    </div>

                    {/* Controls Config */}
                    <div className="space-y-6">
                        {/* Type Switcher */}
                        <div className="inline-flex bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200/50">
                            {['one-time', 'monthly'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setDonationType(type)}
                                    className={`relative py-2.5 px-6 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden ${donationType === type
                                        ? 'text-primary shadow-sm ring-1 ring-black/5'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {donationType === type && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-white rounded-xl"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {type === 'one-time' ? <Gift className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                                        <span className="capitalize">{type}</span>
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Amount Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {suggestedAmounts.map((value) => (
                                <button
                                    key={value}
                                    onClick={() => handleAmountSelect(value)}
                                    className={`group relative py-3.5 px-2 rounded-2xl text-sm font-bold transition-all duration-300 overflow-hidden ${amount === value && !customAmount
                                        ? 'text-white shadow-lg shadow-primary/25 ring-2 ring-primary ring-offset-2'
                                        : 'bg-white text-gray-600 border border-gray-100 hover:border-secondary/30 hover:bg-secondary/5'
                                        }`}
                                >
                                    {amount === value && !customAmount && (
                                        <motion.div
                                            layoutId="activeAmount"
                                            className="absolute inset-0 bg-primary"
                                        />
                                    )}
                                    <span className="relative z-10">₹{value.toLocaleString()}</span>
                                </button>
                            ))}
                        </div>

                        {/* Custom Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter custom amount"
                                value={customAmount}
                                onChange={handleCustomAmount}
                                className="w-full py-4 pl-12 pr-4 rounded-xl bg-gray-50/50 border border-gray-200 text-lg font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                            />
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">₹</span>
                        </div>
                        {/* Program Select */}
                        <div className="relative">
                            <select
                                value={selectedProgram}
                                onChange={(e) => setSelectedProgram(e.target.value)}
                                className="w-full p-4 pl-4 pr-10 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-secondary/20 appearance-none cursor-pointer transition-all hover:border-gray-300"
                            >
                                <option value="">General Donation (Where Needed Most)</option>
                                <option value="other">Other Cause</option>
                                {programs.map(program => (
                                    <option key={program._id} value={program._id}>
                                        {program.title}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Right Side - Impact Card */}
                <div className="lg:col-span-5">
                    <div className="h-full bg-[#1A3C5A] rounded-[2rem] p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[400px] shadow-2xl shadow-[#1A3C5A]/30 group transform transition-all hover:scale-[1.01]">

                        {/* Abstract Pattern */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-[60px] pointer-events-none translate-x-1/3 -translate-y-1/3" />

                        <div className="relative z-10 space-y-8">
                            <div>
                                <div className="text-secondary font-bold uppercase tracking-wider text-xs mb-2">Impact Preview</div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl lg:text-7xl font-playfair font-bold tracking-tight">
                                        ₹{amount.toLocaleString()}
                                    </span>
                                    {donationType === 'monthly' && <span className="text-lg text-white/50 lowercase ml-1">/mo</span>}
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Your Contribution</h4>
                                        <p className="text-white/80 leading-relaxed text-sm md:text-base">
                                            {getImpactMessage(amount)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-auto pt-8">
                            <button
                                onClick={handleDonate}
                                className="w-full group btn-secondary py-4 md:py-5 px-6 rounded-2xl font-bold text-lg bg-white text-primary hover:bg-gray-50 flex items-center justify-between transition-all duration-300 shadow-xl"
                            >
                                <span className="flex items-center gap-3">
                                    <Heart className="w-5 h-5 fill-secondary text-secondary" />
                                    Proceed to Donate
                                </span>
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </button>
                            <div className="mt-4 flex items-center justify-center gap-2 text-white/40 text-xs">
                                <Check className="w-3 h-3" />
                                Secure Payment • 80G Tax Benefit
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
