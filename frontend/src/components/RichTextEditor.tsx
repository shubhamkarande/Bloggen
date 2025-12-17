'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useEffect } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[var(--primary-500)] underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full',
                },
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose-editor min-h-[500px] outline-none focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Update content when prop changes
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) {
        return (
            <div className="min-h-[500px] flex items-center justify-center">
                <div className="skeleton h-6 w-48" />
            </div>
        );
    }

    const addLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="relative">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[var(--border)] bg-[var(--background)] rounded-t-lg sticky top-0 z-10">
                {/* Text Style */}
                <div className="flex items-center gap-1 pr-2 border-r border-[var(--border)]">
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]' : ''
                            }`}
                        title="Heading 1"
                    >
                        <span className="font-bold text-lg">H1</span>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]' : ''
                            }`}
                        title="Heading 2"
                    >
                        <span className="font-bold">H2</span>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]' : ''
                            }`}
                        title="Heading 3"
                    >
                        <span className="font-bold text-sm">H3</span>
                    </button>
                </div>

                {/* Formatting */}
                <div className="flex items-center gap-1 px-2 border-r border-[var(--border)]">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors ${editor.isActive('bold') ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]' : ''
                            }`}
                        title="Bold"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors ${editor.isActive('italic') ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]' : ''
                            }`}
                        title="Italic"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-2 0v16m-4 0h8" transform="skewX(-10)" />
                        </svg>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors ${editor.isActive('strike') ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]' : ''
                            }`}
                        title="Strikethrough"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16M12 4v16" transform="rotate(45 12 12)" />
                        </svg>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        className={`p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors ${editor.isActive('code') ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]' : ''
                            }`}
                        title="Inline Code"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </button>
                </div>

                {/* Lists */}
                <div className="flex items-center gap-1 px-2 border-r border-[var(--border)]">
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors ${editor.isActive('bulletList') ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]' : ''
                            }`}
                        title="Bullet List"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors ${editor.isActive('orderedList') ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]' : ''
                            }`}
                        title="Numbered List"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 12h10M7 17h10M3 7h.01M3 12h.01M3 17h.01" />
                        </svg>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors ${editor.isActive('blockquote') ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]' : ''
                            }`}
                        title="Quote"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors ${editor.isActive('codeBlock') ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]' : ''
                            }`}
                        title="Code Block"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1m-2 1l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                        </svg>
                    </button>
                </div>

                {/* Insert */}
                <div className="flex items-center gap-1 pl-2">
                    <button
                        onClick={addLink}
                        className={`p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors ${editor.isActive('link') ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]' : ''
                            }`}
                        title="Add Link"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </button>
                    <button
                        onClick={addImage}
                        className="p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
                        title="Add Image"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        className="p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
                        title="Horizontal Rule"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
                        </svg>
                    </button>
                </div>

                {/* Undo/Redo */}
                <div className="flex items-center gap-1 ml-auto">
                    <button
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors disabled:opacity-50"
                        title="Undo"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className="p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors disabled:opacity-50"
                        title="Redo"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Editor Content */}
            <div className="p-4 min-h-[500px]">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
