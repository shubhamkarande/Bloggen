'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--background-secondary)]/80 backdrop-blur-xl"
        >
            <div className="container-main flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-400)] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold gradient-text">Bloggen</span>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors text-sm font-medium">
                        Features
                    </Link>
                    <Link href="#how-it-works" className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors text-sm font-medium">
                        How It Works
                    </Link>
                    <Link href="#pricing" className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors text-sm font-medium">
                        Pricing
                    </Link>
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-3">
                    <Link href="/login" className="btn btn-ghost text-sm">
                        Sign In
                    </Link>
                    <Link href="/register" className="btn btn-primary text-sm">
                        Get Started Free
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
