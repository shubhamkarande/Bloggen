'use client';

import { motion } from 'framer-motion';

interface SeoScoreMeterProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export default function SeoScoreMeter({ score, size = 'md', showLabel = true }: SeoScoreMeterProps) {
    const sizes = {
        sm: { width: 60, stroke: 6, text: 'text-sm' },
        md: { width: 100, stroke: 8, text: 'text-xl' },
        lg: { width: 140, stroke: 10, text: 'text-3xl' },
    };

    const { width, stroke, text } = sizes[size];
    const radius = (width - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;

    const getColor = (score: number) => {
        if (score >= 80) return 'var(--success)';
        if (score >= 60) return 'var(--accent-gold)';
        if (score >= 40) return 'var(--warning)';
        return 'var(--error)';
    };

    const getLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Poor';
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width, height: width }}>
                {/* Background Circle */}
                <svg
                    className="absolute inset-0 -rotate-90"
                    width={width}
                    height={width}
                >
                    <circle
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        fill="none"
                        stroke="var(--border)"
                        strokeWidth={stroke}
                    />
                </svg>

                {/* Progress Circle */}
                <svg
                    className="absolute inset-0 -rotate-90"
                    width={width}
                    height={width}
                >
                    <motion.circle
                        cx={width / 2}
                        cy={width / 2}
                        r={radius}
                        fill="none"
                        stroke={getColor(score)}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference - progress }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                            filter: `drop-shadow(0 0 8px ${getColor(score)}40)`,
                        }}
                    />
                </svg>

                {/* Score Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                        className={`font-bold ${text}`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{ color: getColor(score) }}
                    >
                        {score}
                    </motion.span>
                </div>
            </div>

            {showLabel && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-center"
                >
                    <span
                        className="text-sm font-medium"
                        style={{ color: getColor(score) }}
                    >
                        {getLabel(score)}
                    </span>
                    <span className="text-xs text-[var(--foreground-muted)] block">
                        SEO Score
                    </span>
                </motion.div>
            )}
        </div>
    );
}
