'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Blog } from '@/lib/api';

interface BlogCardProps {
    blog: Blog;
    onDelete?: (id: string) => void;
}

export default function BlogCard({ blog, onDelete }: BlogCardProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-[var(--success)]';
        if (score >= 60) return 'text-[var(--accent-gold)]';
        if (score >= 40) return 'text-[var(--warning)]';
        return 'text-[var(--error)]';
    };

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ y: -4 }}
            className="card group cursor-pointer"
        >
            <Link href={`/editor/${blog.id}`} className="block">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-[var(--primary-600)] transition-colors">
                            {blog.title || 'Untitled Blog'}
                        </h3>
                        <p className="text-sm text-[var(--foreground-muted)] mt-1">
                            {formatDate(blog.updated_at)}
                        </p>
                    </div>

                    {/* Status Badge */}
                    <span className={`badge ${blog.status === 'published' ? 'badge-success' : 'badge-warning'
                        }`}>
                        {blog.status}
                    </span>
                </div>

                {/* Content Preview */}
                <div
                    className="text-sm text-[var(--foreground-muted)] line-clamp-2 mb-4 prose-editor"
                    dangerouslySetInnerHTML={{
                        __html: blog.content?.substring(0, 200).replace(/<[^>]*>/g, '') || 'No content yet...',
                    }}
                />

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                        {/* Reading Time */}
                        <div className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{blog.reading_time || 1} min</span>
                        </div>

                        {/* SEO Score */}
                        <div className={`flex items-center gap-1.5 ${getScoreColor(blog.seo_score)}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="font-medium">{blog.seo_score}%</span>
                        </div>
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                            {blog.tags.slice(0, 2).map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs px-2 py-0.5 rounded-full bg-[var(--background)] text-[var(--foreground-muted)]"
                                >
                                    {tag}
                                </span>
                            ))}
                            {blog.tags.length > 2 && (
                                <span className="text-xs text-[var(--foreground-muted)]">
                                    +{blog.tags.length - 2}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </Link>

            {/* Delete Button (on hover) */}
            {onDelete && (
                <motion.button
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete(blog.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-[var(--error)]/10 text-[var(--error)] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--error)]/20"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </motion.button>
            )}
        </motion.article>
    );
}
