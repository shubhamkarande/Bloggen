'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api, { AiUsageData } from '@/lib/api';

export default function AdminAiUsagePage() {
    const [data, setData] = useState<AiUsageData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const response = await api.getAiUsage();
            if (response.data) {
                setData(response.data);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="skeleton h-10 w-48 mb-8" />
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {[1, 2].map((i) => (
                        <div key={i} className="card">
                            <div className="skeleton h-8 w-24 mb-2" />
                            <div className="skeleton h-4 w-32" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold mb-2">AI Usage Analytics</h1>
                <p className="text-[var(--foreground-muted)]">
                    Monitor AI token consumption and usage patterns
                </p>
            </motion.div>

            {/* Overview Stats */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-[var(--primary-500)]/10 flex items-center justify-center">
                            <span className="text-3xl">📊</span>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[var(--primary-500)]">
                                {data?.total_requests?.toLocaleString() || 0}
                            </p>
                            <p className="text-[var(--foreground-muted)]">Total AI Requests</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-[var(--accent-gold)]/10 flex items-center justify-center">
                            <span className="text-3xl">🎯</span>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[var(--accent-gold)]">
                                {data?.total_tokens?.toLocaleString() || 0}
                            </p>
                            <p className="text-[var(--foreground-muted)]">Total Tokens Used</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Usage by Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card"
                >
                    <h2 className="text-lg font-semibold mb-4">Usage by Action</h2>
                    <div className="space-y-3">
                        {data?.usage_by_action?.map((item) => {
                            const colors: Record<string, string> = {
                                generate_outline: 'var(--primary-500)',
                                generate_content: 'var(--accent-blue)',
                                seo_analyze: 'var(--success)',
                                rewrite: 'var(--accent-gold)',
                                expand: 'var(--accent-cyan)',
                            };
                            const maxTokens = Math.max(...(data.usage_by_action?.map(a => a.total_tokens) || [1]));
                            const percentage = (item.total_tokens / maxTokens) * 100;

                            return (
                                <div key={item.action}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium capitalize">
                                            {item.action.replace('_', ' ')}
                                        </span>
                                        <span className="text-sm text-[var(--foreground-muted)]">
                                            {item.count} calls • {item.total_tokens.toLocaleString()} tokens
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-[var(--background)] overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: colors[item.action] || 'var(--primary-500)' }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {(!data?.usage_by_action || data.usage_by_action.length === 0) && (
                            <p className="text-[var(--foreground-muted)] text-center py-4">No AI usage yet</p>
                        )}
                    </div>
                </motion.div>

                {/* Top Users */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card"
                >
                    <h2 className="text-lg font-semibold mb-4">Top AI Users</h2>
                    <div className="space-y-3">
                        {data?.top_users?.slice(0, 5).map((item, index) => (
                            <div key={item.user_id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background)]">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-blue)] flex items-center justify-center text-white font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{item.user?.name || 'Unknown'}</p>
                                    <p className="text-xs text-[var(--foreground-muted)]">
                                        {item.request_count} requests
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-[var(--accent-gold)]">
                                    {item.total_tokens.toLocaleString()} tokens
                                </p>
                            </div>
                        ))}
                        {(!data?.top_users || data.top_users.length === 0) && (
                            <p className="text-[var(--foreground-muted)] text-center py-4">No AI usage yet</p>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Daily Usage Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card mt-6"
            >
                <h2 className="text-lg font-semibold mb-4">Daily Usage (Last 7 Days)</h2>
                <div className="flex items-end gap-2 h-40">
                    {data?.daily_usage?.slice(-7).map((day) => {
                        const maxTokens = Math.max(...(data.daily_usage?.map(d => d.tokens) || [1]));
                        const height = (day.tokens / maxTokens) * 100;

                        return (
                            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max(height, 5)}%` }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className="w-full rounded-t-lg bg-gradient-to-t from-[var(--primary-600)] to-[var(--primary-400)]"
                                />
                                <span className="text-xs text-[var(--foreground-muted)]">
                                    {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                                </span>
                            </div>
                        );
                    })}
                    {(!data?.daily_usage || data.daily_usage.length === 0) && (
                        <p className="text-[var(--foreground-muted)] text-center py-4 w-full">No daily data yet</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
