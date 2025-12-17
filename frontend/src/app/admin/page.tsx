'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api, { AdminDashboardData } from '@/lib/api';

export default function AdminDashboardPage() {
    const [data, setData] = useState<AdminDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const response = await api.getAdminDashboard();
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
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="card">
                            <div className="skeleton h-8 w-16 mb-2" />
                            <div className="skeleton h-4 w-24" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const stats = [
        { label: 'Total Users', value: data?.stats.total_users || 0, color: 'var(--primary-500)', icon: '👥' },
        { label: 'Total Blogs', value: data?.stats.total_blogs || 0, color: 'var(--accent-blue)', icon: '📝' },
        { label: 'Published', value: data?.stats.published_blogs || 0, color: 'var(--success)', icon: '✅' },
        { label: 'AI Tokens Used', value: data?.stats.total_tokens_used?.toLocaleString() || 0, color: 'var(--accent-gold)', icon: '🤖' },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-[var(--foreground-muted)]">
                    Monitor platform usage and manage users
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{stat.icon}</span>
                            <div>
                                <p className="text-2xl font-bold" style={{ color: stat.color }}>
                                    {stat.value}
                                </p>
                                <p className="text-sm text-[var(--foreground-muted)]">{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Users */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card"
                >
                    <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
                    <div className="space-y-3">
                        {data?.recent_users?.slice(0, 5).map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--background)]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-blue)] flex items-center justify-center text-white font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-[var(--foreground-muted)]">{user.email}</p>
                                    </div>
                                </div>
                                <span className={`badge ${user.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>
                                    {user.role}
                                </span>
                            </div>
                        ))}
                        {(!data?.recent_users || data.recent_users.length === 0) && (
                            <p className="text-[var(--foreground-muted)] text-center py-4">No users yet</p>
                        )}
                    </div>
                </motion.div>

                {/* Recent Blogs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card"
                >
                    <h2 className="text-lg font-semibold mb-4">Recent Blogs</h2>
                    <div className="space-y-3">
                        {data?.recent_blogs?.slice(0, 5).map((blog) => (
                            <div key={blog.id} className="p-3 rounded-lg bg-[var(--background)]">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-medium truncate flex-1 mr-2">{blog.title || 'Untitled'}</p>
                                    <span className={`badge ${blog.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                                        {blog.status}
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--foreground-muted)]">
                                    by {blog.author} • {new Date(blog.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                        {(!data?.recent_blogs || data.recent_blogs.length === 0) && (
                            <p className="text-[var(--foreground-muted)] text-center py-4">No blogs yet</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
