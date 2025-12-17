'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-100)]/30 via-transparent to-[var(--accent-cyan)]/10 dark:from-[var(--primary-900)]/20 dark:to-[var(--accent-cyan)]/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-cyan)] opacity-10 blur-3xl" />

        <div className="container-main relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-100)] dark:bg-[var(--primary-900)]/30 text-[var(--primary-700)] dark:text-[var(--primary-300)] text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
              AI-Powered • 100% Free Tier Compatible
            </motion.div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Write smarter.{' '}
              <span className="gradient-text">Rank faster.</span>
              <br />
              Publish better.
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-[var(--foreground-muted)] mb-10 max-w-2xl mx-auto">
              Bloggen is your AI writing assistant that helps you create high-quality,
              SEO-optimized blog posts in minutes instead of hours.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="btn btn-primary text-lg px-8 py-4">
                Start Writing Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="#how-it-works" className="btn btn-secondary text-lg px-8 py-4">
                See How It Works
              </Link>
            </div>
          </motion.div>

          {/* Hero Image/Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 relative"
          >
            <div className="card-glass rounded-2xl p-2 shadow-2xl max-w-5xl mx-auto">
              <div className="rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] overflow-hidden">
                {/* Mock Editor Preview */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--background)]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[var(--error)]" />
                    <div className="w-3 h-3 rounded-full bg-[var(--warning)]" />
                    <div className="w-3 h-3 rounded-full bg-[var(--success)]" />
                  </div>
                  <span className="text-sm text-[var(--foreground-muted)] ml-2">Bloggen Editor</span>
                </div>
                <div className="p-6 min-h-[300px] flex gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="skeleton h-8 w-3/4" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-5/6" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-4/5" />
                    <div className="skeleton h-6 w-1/2 mt-6" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-3/4" />
                  </div>
                  <div className="w-64 space-y-4">
                    <div className="p-4 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                      <div className="text-center mb-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--success)] to-[var(--accent-emerald)] mx-auto flex items-center justify-center text-white text-2xl font-bold">
                          85
                        </div>
                        <p className="text-sm text-[var(--success)] font-medium mt-2">Excellent</p>
                        <p className="text-xs text-[var(--foreground-muted)]">SEO Score</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="skeleton h-10 w-full" />
                      <div className="skeleton h-10 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Everything you need to write{' '}
              <span className="gradient-text">amazing content</span>
            </h2>
            <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
              From ideation to publication, Bloggen guides you through every step of the content creation process.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: 'AI-Powered Writing',
                description: 'Generate outlines, drafts, and full blog posts with our advanced AI. Get suggestions for titles, meta descriptions, and more.',
                color: 'var(--primary-500)',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'SEO Optimization',
                description: 'Real-time SEO analysis with actionable suggestions. Watch your score improve as you write.',
                color: 'var(--accent-emerald)',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                ),
                title: 'Export Anywhere',
                description: 'Export your content as Markdown, HTML, or WordPress-ready format. Copy to clipboard with perfect formatting.',
                color: 'var(--accent-blue)',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center group"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-[var(--foreground-muted)]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-[var(--background-secondary)]">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              From idea to published post in{' '}
              <span className="gradient-text">4 simple steps</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Enter Your Topic', desc: 'Tell us what you want to write about and your target keywords.' },
              { step: '02', title: 'AI Generates Outline', desc: 'Get a structured outline with title options and section headers.' },
              { step: '03', title: 'Refine & Generate', desc: 'Edit the outline, then let AI generate your full draft.' },
              { step: '04', title: 'Optimize & Publish', desc: 'Polish your content with SEO suggestions and export anywhere.' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center relative"
              >
                <div className="text-6xl font-bold gradient-text opacity-20 mb-2">{item.step}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--foreground-muted)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card-glass rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-600)]/10 to-[var(--accent-cyan)]/10" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready to write smarter?</h2>
              <p className="text-lg text-[var(--foreground-muted)] mb-8 max-w-xl mx-auto">
                Join thousands of content creators using Bloggen to produce high-quality, SEO-optimized content faster than ever.
              </p>
              <Link href="/register" className="btn btn-primary text-lg px-10 py-4">
                Get Started Free
              </Link>
              <p className="text-sm text-[var(--foreground-muted)] mt-4">
                No credit card required • 100% free tier
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[var(--border)]">
        <div className="container-main flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-400)] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="font-semibold">Bloggen</span>
          </div>
          <p className="text-sm text-[var(--foreground-muted)]">
            © 2025 Bloggen. Built with ❤️ for content creators.
          </p>
        </div>
      </footer>
    </main>
  );
}
