'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useBlog } from '@/hooks/useBlog';
import SeoScoreMeter from '@/components/SeoScoreMeter';
import RichTextEditor from '@/components/RichTextEditor';
import api, { SeoAnalysisResponse } from '@/lib/api';

type EditorStep = 'topic' | 'outline' | 'content' | 'seo';

interface OutlineItem {
    level: string;
    text: string;
}

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { createBlog, updateBlog, currentBlog, fetchBlog } = useBlog();

    const isNew = params.id === 'new';
    const blogId = isNew ? null : params.id as string;

    // Editor state
    const [step, setStep] = useState<EditorStep>(isNew ? 'topic' : 'content');
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [tone, setTone] = useState<'professional' | 'casual' | 'technical' | 'storytelling'>(user?.preferences?.tone || 'professional');
    const [wordCount, setWordCount] = useState(1500);
    const [seoFocus, setSeoFocus] = useState<'google' | 'medium' | 'devto'>('google');

    // Outline state
    const [titleOptions, setTitleOptions] = useState<string[]>([]);
    const [selectedTitle, setSelectedTitle] = useState('');
    const [outline, setOutline] = useState<OutlineItem[]>([]);

    // Content state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');

    // SEO state
    const [seoAnalysis, setSeoAnalysis] = useState<SeoAnalysisResponse | null>(null);
    const [seoScore, setSeoScore] = useState(0);

    // Loading states
    const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
    const [isGeneratingContent, setIsGeneratingContent] = useState(false);
    const [isAnalyzingSeo, setIsAnalyzingSeo] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

    // Load existing blog
    useEffect(() => {
        if (blogId) {
            fetchBlog(blogId);
        }
    }, [blogId, fetchBlog]);

    // Initialize blog data when loaded
    const blogTitle = currentBlog?.title;
    const blogContent = currentBlog?.content;
    const blogStatus = currentBlog?.status;
    const blogSeoScore = currentBlog?.seo_score;

    useEffect(() => {
        if (blogTitle && blogId) {
            setTitle(blogTitle);
            setContent(blogContent || '');
            setStatus(blogStatus || 'draft');
            setSeoScore(blogSeoScore || 0);
            setStep('content');
        }
    }, [blogTitle, blogContent, blogStatus, blogSeoScore, blogId]);

    // Auto-save
    const autoSave = useCallback(async () => {
        if (!title || !blogId) return;

        setAutoSaveStatus('saving');
        await updateBlog(blogId, { title, content, status });
        setAutoSaveStatus('saved');
    }, [title, content, status, blogId, updateBlog]);

    useEffect(() => {
        if (!isNew && title && content) {
            const timer = setTimeout(() => {
                setAutoSaveStatus('unsaved');
                autoSave();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [title, content, isNew, autoSave]);

    // Generate outline
    const handleGenerateOutline = async () => {
        if (!topic) return;

        setIsGeneratingOutline(true);
        const response = await api.generateOutline({
            topic,
            keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
            tone,
            word_count: wordCount,
            seo_focus: seoFocus,
        });

        if (response.data?.data) {
            setTitleOptions(response.data.data.title_options || []);
            setOutline(response.data.data.outline || []);
            setStep('outline');
        }

        setIsGeneratingOutline(false);
    };

    // Generate content
    const handleGenerateContent = async () => {
        if (!selectedTitle || outline.length === 0) return;

        setIsGeneratingContent(true);
        const response = await api.generateContent({
            outline,
            title: selectedTitle,
            keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
            tone,
            word_count: wordCount,
        });

        if (response.data?.data) {
            setTitle(selectedTitle);
            setContent(response.data.data.content || '');
            setStep('content');

            // Create the blog
            if (isNew) {
                const blog = await createBlog({
                    title: selectedTitle,
                    content: response.data.data.content,
                    status: 'draft',
                });
                if (blog) {
                    router.replace(`/editor/${blog.id}`);
                }
            }
        }

        setIsGeneratingContent(false);
    };

    // Analyze SEO
    const handleAnalyzeSeo = async () => {
        if (!content) return;

        setIsAnalyzingSeo(true);
        const response = await api.analyzeSeo({
            title,
            content,
            keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
        });

        if (response.data?.data) {
            setSeoAnalysis(response.data.data);
            setSeoScore(response.data.data.seo_score);
            setStep('seo');

            if (blogId) {
                await updateBlog(blogId, {
                    title,
                    content,
                    status,
                    seo_score: response.data.data.seo_score
                });
            }
        }

        setIsAnalyzingSeo(false);
    };

    // Save blog
    const handleSave = async (newStatus?: 'draft' | 'published') => {
        setIsSaving(true);

        if (blogId) {
            await updateBlog(blogId, {
                title,
                content,
                status: newStatus || status
            });
        }

        setIsSaving(false);
    };

    // Export
    const handleExport = async (format: 'markdown' | 'html' | 'wordpress') => {
        if (!blogId) return;

        const response = await api.exportBlog(blogId, format);
        if (response.data?.content) {
            navigator.clipboard.writeText(response.data.content);
            alert(`Copied ${format.toUpperCase()} to clipboard!`);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <header className="fixed top-0 left-64 right-0 h-16 bg-[var(--background-secondary)]/80 backdrop-blur-xl border-b border-[var(--border)] z-30 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="btn btn-ghost p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="font-semibold">{title || 'New Blog Post'}</h1>
                        <p className="text-xs text-[var(--foreground-muted)]">
                            {autoSaveStatus === 'saving' && 'Saving...'}
                            {autoSaveStatus === 'saved' && 'All changes saved'}
                            {autoSaveStatus === 'unsaved' && 'Unsaved changes'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {blogId && (
                        <>
                            <div className="relative group">
                                <button className="btn btn-secondary">
                                    Export
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <button onClick={() => handleExport('markdown')} className="w-full px-4 py-2 text-left hover:bg-[var(--background)] text-sm">
                                        Copy as Markdown
                                    </button>
                                    <button onClick={() => handleExport('html')} className="w-full px-4 py-2 text-left hover:bg-[var(--background)] text-sm">
                                        Copy as HTML
                                    </button>
                                    <button onClick={() => handleExport('wordpress')} className="w-full px-4 py-2 text-left hover:bg-[var(--background)] text-sm">
                                        Copy as WordPress XML
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={handleAnalyzeSeo}
                                disabled={isAnalyzingSeo}
                                className="btn btn-secondary"
                            >
                                {isAnalyzingSeo ? 'Analyzing...' : 'Analyze SEO'}
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => handleSave('published')}
                        disabled={isSaving || !title}
                        className="btn btn-primary"
                    >
                        {isSaving ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-16 ml-64 min-h-screen flex">
                {/* Editor Area */}
                <div className="flex-1 p-6">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Topic */}
                        {step === 'topic' && (
                            <motion.div
                                key="topic"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-2xl mx-auto"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold mb-2">What do you want to write about?</h2>
                                    <p className="text-[var(--foreground-muted)]">
                                        Enter your topic and AI will generate an outline for you
                                    </p>
                                </div>

                                <div className="card space-y-5">
                                    <div>
                                        <label className="label">Topic or Title</label>
                                        <input
                                            type="text"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            className="input"
                                            placeholder="e.g., How to Build a REST API with Node.js"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Target Keywords (comma-separated)</label>
                                        <input
                                            type="text"
                                            value={keywords}
                                            onChange={(e) => setKeywords(e.target.value)}
                                            className="input"
                                            placeholder="e.g., REST API, Node.js, Express"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">Writing Tone</label>
                                            <select
                                                value={tone}
                                                onChange={(e) => setTone(e.target.value as 'professional' | 'casual' | 'technical' | 'storytelling')}
                                                className="input"
                                            >
                                                <option value="professional">Professional</option>
                                                <option value="casual">Casual</option>
                                                <option value="technical">Technical</option>
                                                <option value="storytelling">Storytelling</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="label">Target Word Count</label>
                                            <input
                                                type="number"
                                                value={wordCount}
                                                onChange={(e) => setWordCount(parseInt(e.target.value))}
                                                className="input"
                                                min={500}
                                                max={5000}
                                                step={100}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label">SEO Focus</label>
                                        <div className="flex gap-2">
                                            {(['google', 'medium', 'devto'] as const).map((focus) => (
                                                <button
                                                    key={focus}
                                                    onClick={() => setSeoFocus(focus)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${seoFocus === focus
                                                        ? 'bg-[var(--primary-500)] text-white'
                                                        : 'bg-[var(--background)] border border-[var(--border)]'
                                                        }`}
                                                >
                                                    {focus === 'devto' ? 'Dev.to' : focus.charAt(0).toUpperCase() + focus.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleGenerateOutline}
                                        disabled={!topic || isGeneratingOutline}
                                        className="btn btn-primary w-full py-3"
                                    >
                                        {isGeneratingOutline ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Generating Outline...
                                            </span>
                                        ) : (
                                            'Generate Outline'
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Outline */}
                        {step === 'outline' && (
                            <motion.div
                                key="outline"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-2xl mx-auto"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold mb-2">Choose Your Title & Review Outline</h2>
                                    <p className="text-[var(--foreground-muted)]">
                                        Select a title and edit the outline if needed
                                    </p>
                                </div>

                                <div className="card mb-6">
                                    <label className="label">Select a Title</label>
                                    <div className="space-y-2">
                                        {titleOptions.map((t, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedTitle(t)}
                                                className={`w-full p-3 rounded-lg text-left transition-all ${selectedTitle === t
                                                    ? 'bg-[var(--primary-500)] text-white'
                                                    : 'bg-[var(--background)] border border-[var(--border)] hover:border-[var(--primary-400)]'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="card mb-6">
                                    <label className="label">Outline</label>
                                    <div className="space-y-2">
                                        {outline.map((item, i) => (
                                            <div
                                                key={i}
                                                className={`flex items-center gap-3 p-2 rounded-lg bg-[var(--background)] ${item.level === 'h1' ? 'font-bold text-lg' :
                                                    item.level === 'h2' ? 'font-semibold pl-4' :
                                                        item.level === 'h3' ? 'text-sm pl-8 text-[var(--foreground-muted)]' : ''
                                                    }`}
                                            >
                                                <span className="text-xs text-[var(--foreground-muted)] uppercase">
                                                    {item.level}
                                                </span>
                                                <span>{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep('topic')}
                                        className="btn btn-secondary flex-1"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleGenerateContent}
                                        disabled={!selectedTitle || isGeneratingContent}
                                        className="btn btn-primary flex-1"
                                    >
                                        {isGeneratingContent ? 'Generating...' : 'Generate Content'}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Content Editor */}
                        {step === 'content' && (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-4xl mx-auto"
                            >
                                <div className="card overflow-hidden">
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Blog Title"
                                        className="text-3xl font-bold w-full bg-transparent border-none outline-none p-4 pb-0"
                                    />
                                    <RichTextEditor
                                        content={content}
                                        onChange={setContent}
                                        placeholder="Start writing your amazing blog post..."
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: SEO Analysis */}
                        {step === 'seo' && seoAnalysis && (
                            <motion.div
                                key="seo"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-4xl mx-auto"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <button onClick={() => setStep('content')} className="btn btn-secondary">
                                        ← Back to Editor
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    {/* Score */}
                                    <div className="card text-center">
                                        <SeoScoreMeter score={seoScore} size="lg" />
                                    </div>

                                    {/* Meta */}
                                    <div className="md:col-span-2 card">
                                        <h3 className="font-semibold mb-4">Meta Information</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="label">Meta Title</label>
                                                <input
                                                    type="text"
                                                    value={seoAnalysis.meta_title}
                                                    className="input"
                                                    readOnly
                                                />
                                                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                                                    {seoAnalysis.meta_title?.length || 0}/60 characters
                                                </p>
                                            </div>
                                            <div>
                                                <label className="label">Meta Description</label>
                                                <textarea
                                                    value={seoAnalysis.meta_description}
                                                    className="input resize-none"
                                                    rows={3}
                                                    readOnly
                                                />
                                                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                                                    {seoAnalysis.meta_description?.length || 0}/155 characters
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Suggestions */}
                                <div className="card mt-6">
                                    <h3 className="font-semibold mb-4">SEO Suggestions</h3>
                                    <ul className="space-y-2">
                                        {seoAnalysis.suggestions?.map((suggestion, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <svg className="w-5 h-5 text-[var(--accent-gold)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Keywords */}
                                <div className="card mt-6">
                                    <h3 className="font-semibold mb-4">Keywords</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {seoAnalysis.keywords?.map((keyword, i) => (
                                            <span key={i} className="badge badge-primary">{keyword}</span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-[var(--foreground-muted)] mt-3">
                                        Keyword Density: {seoAnalysis.keyword_density}% •
                                        Readability Score: {seoAnalysis.readability_score}%
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Sidebar - SEO Panel */}
                {step === 'content' && (
                    <motion.aside
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-72 border-l border-[var(--border)] p-4 space-y-4"
                    >
                        <div className="card text-center">
                            <SeoScoreMeter score={seoScore} size="md" />
                        </div>

                        <div className="card">
                            <h4 className="font-semibold text-sm mb-3">Quick Stats</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[var(--foreground-muted)]">Words</span>
                                    <span>{content.split(/\s+/).filter(Boolean).length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--foreground-muted)]">Reading Time</span>
                                    <span>{Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200))} min</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--foreground-muted)]">Characters</span>
                                    <span>{content.replace(/<[^>]*>/g, '').length}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAnalyzeSeo}
                            disabled={isAnalyzingSeo || !content}
                            className="btn btn-primary w-full"
                        >
                            {isAnalyzingSeo ? 'Analyzing...' : 'Run SEO Analysis'}
                        </button>
                    </motion.aside>
                )}
            </main>
        </div>
    );
}
