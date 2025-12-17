'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth';

const niches = [
    'Technology', 'Marketing', 'Finance', 'Health & Wellness',
    'Travel', 'Food', 'Lifestyle', 'Business', 'Education', 'Entertainment'
];

const audiences = [
    'General readers', 'Professionals', 'Beginners', 'Experts',
    'Students', 'Business owners', 'Developers', 'Marketers'
];

const tones = [
    { value: 'professional', label: 'Professional', desc: 'Formal and authoritative' },
    { value: 'casual', label: 'Casual', desc: 'Friendly and conversational' },
    { value: 'technical', label: 'Technical', desc: 'Detailed and precise' },
    { value: 'storytelling', label: 'Storytelling', desc: 'Engaging and narrative' },
];

export default function OnboardingPage() {
    const router = useRouter();
    const { updatePreferences } = useAuth();
    const [step, setStep] = useState(1);
    const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
    const [selectedAudience, setSelectedAudience] = useState('');
    const [selectedTone, setSelectedTone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleNiche = (niche: string) => {
        setSelectedNiches(prev =>
            prev.includes(niche)
                ? prev.filter(n => n !== niche)
                : [...prev, niche]
        );
    };

    const handleComplete = async () => {
        setIsLoading(true);

        await updatePreferences({
            niches: selectedNiches,
            audience: selectedAudience,
            tone: selectedTone as 'professional' | 'casual' | 'technical' | 'storytelling',
        });

        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-100)]/30 via-transparent to-[var(--accent-cyan)]/10 dark:from-[var(--primary-900)]/20 dark:to-[var(--accent-cyan)]/5" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-2xl relative z-10"
            >
                {/* Progress */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-2 w-16 rounded-full transition-colors ${s <= step ? 'bg-[var(--primary-500)]' : 'bg-[var(--border)]'
                                }`}
                        />
                    ))}
                </div>

                <div className="card-glass rounded-2xl p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h1 className="text-2xl font-bold mb-2 text-center">What do you write about?</h1>
                                <p className="text-[var(--foreground-muted)] text-center mb-8">
                                    Select your writing niches (pick as many as you want)
                                </p>

                                <div className="flex flex-wrap gap-3 justify-center mb-8">
                                    {niches.map((niche) => (
                                        <button
                                            key={niche}
                                            onClick={() => toggleNiche(niche)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedNiches.includes(niche)
                                                    ? 'bg-[var(--primary-500)] text-white shadow-lg'
                                                    : 'bg-[var(--background)] border border-[var(--border)] hover:border-[var(--primary-400)]'
                                                }`}
                                        >
                                            {niche}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    disabled={selectedNiches.length === 0}
                                    className="btn btn-primary w-full py-3 disabled:opacity-50"
                                >
                                    Continue
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h1 className="text-2xl font-bold mb-2 text-center">Who&apos;s your audience?</h1>
                                <p className="text-[var(--foreground-muted)] text-center mb-8">
                                    This helps us tailor AI suggestions for your readers
                                </p>

                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    {audiences.map((audience) => (
                                        <button
                                            key={audience}
                                            onClick={() => setSelectedAudience(audience)}
                                            className={`p-4 rounded-xl text-left transition-all ${selectedAudience === audience
                                                    ? 'bg-[var(--primary-500)] text-white shadow-lg'
                                                    : 'bg-[var(--background)] border border-[var(--border)] hover:border-[var(--primary-400)]'
                                                }`}
                                        >
                                            {audience}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="btn btn-secondary flex-1 py-3"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => setStep(3)}
                                        disabled={!selectedAudience}
                                        className="btn btn-primary flex-1 py-3 disabled:opacity-50"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h1 className="text-2xl font-bold mb-2 text-center">What&apos;s your writing style?</h1>
                                <p className="text-[var(--foreground-muted)] text-center mb-8">
                                    Choose your default tone (you can change this per blog)
                                </p>

                                <div className="space-y-3 mb-8">
                                    {tones.map((tone) => (
                                        <button
                                            key={tone.value}
                                            onClick={() => setSelectedTone(tone.value)}
                                            className={`w-full p-4 rounded-xl text-left transition-all ${selectedTone === tone.value
                                                    ? 'bg-[var(--primary-500)] text-white shadow-lg'
                                                    : 'bg-[var(--background)] border border-[var(--border)] hover:border-[var(--primary-400)]'
                                                }`}
                                        >
                                            <div className="font-semibold">{tone.label}</div>
                                            <div className={`text-sm ${selectedTone === tone.value ? 'text-white/80' : 'text-[var(--foreground-muted)]'}`}>
                                                {tone.desc}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="btn btn-secondary flex-1 py-3"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleComplete}
                                        disabled={!selectedTone || isLoading}
                                        className="btn btn-primary flex-1 py-3 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Setting up...' : 'Get Started'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    onClick={() => router.push('/dashboard')}
                    className="block mx-auto mt-6 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                >
                    Skip for now
                </button>
            </motion.div>
        </div>
    );
}
