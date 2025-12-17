'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useBlog } from '@/hooks/useBlog';
import BlogCard from '@/components/BlogCard';

export default function DashboardPage() {
    const { user } = useAuth();
    const { blogs, fetchBlogs, isLoading, deleteBlog } = useBlog();
    const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const handleDelete = async () => {
        if (showDeleteModal) {
            await deleteBlog(showDeleteModal);
            setShowDeleteModal(null);
        }
    };

    const stats = [
        {
            label: 'Total Blogs',
            value: blogs.length,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ),
            color: 'var(--primary-500)'
        },
        {
            label: 'Published',
            value: blogs.filter(b => b.status === 'published').length,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'var(--success)'
        },
        {
            label: 'Drafts',
            value: blogs.filter(b => b.status === 'draft').length,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            color: 'var(--accent-gold)'
        },
        {
            label: 'Avg SEO Score',
            value: blogs.length > 0 ? Math.round(blogs.reduce((acc, b) => acc + b.seo_score, 0) / blogs.length) : 0,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            color: 'var(--accent-blue)',
            suffix: '%'
        },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-[var(--foreground-muted)]">
                    Here&apos;s an overview of your content
                </p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card flex items-center gap-4"
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                        >
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stat.value}{stat.suffix}</p>
                            <p className="text-sm text-[var(--foreground-muted)]">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card mb-8 flex items-center justify-between"
            >
                <div>
                    <h2 className="text-lg font-semibold mb-1">Ready to create something amazing?</h2>
                    <p className="text-sm text-[var(--foreground-muted)]">
                        Start a new blog post with AI assistance
                    </p>
                </div>
                <Link href="/editor/new" className="btn btn-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Blog
                </Link>
            </motion.div>

            {/* Recent Blogs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Recent Blogs</h2>
                    <Link href="/dashboard/blogs" className="text-sm text-[var(--primary-600)] hover:underline">
                        View all →
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="card">
                                <div className="skeleton h-6 w-3/4 mb-3" />
                                <div className="skeleton h-4 w-full mb-2" />
                                <div className="skeleton h-4 w-5/6" />
                            </div>
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="card text-center py-12">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--primary-100)] dark:bg-[var(--primary-900)]/30 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-[var(--primary-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No blogs yet</h3>
                        <p className="text-[var(--foreground-muted)] mb-4">
                            Create your first AI-powered blog post
                        </p>
                        <Link href="/editor/new" className="btn btn-primary">
                            Start Writing
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {blogs.slice(0, 6).map((blog) => (
                            <BlogCard
                                key={blog.id}
                                blog={blog}
                                onDelete={() => setShowDeleteModal(blog.id)}
                            />
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card max-w-md w-full mx-4"
                    >
                        <h3 className="text-lg font-semibold mb-2">Delete Blog</h3>
                        <p className="text-[var(--foreground-muted)] mb-6">
                            Are you sure you want to delete this blog? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn bg-[var(--error)] text-white hover:bg-[var(--error)]/90"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
