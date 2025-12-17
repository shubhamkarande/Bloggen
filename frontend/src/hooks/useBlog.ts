'use client';

import { useState, useCallback } from 'react';
import api, {
    Blog,
    CreateBlogData,
    GenerateOutlineData,
    OutlineResponse,
    GenerateContentData,
    AnalyzeSeoData,
    SeoAnalysisResponse,
} from '@/lib/api';

interface UseBlogReturn {
    blogs: Blog[];
    currentBlog: Blog | null;
    isLoading: boolean;
    error: string | null;
    fetchBlogs: (page?: number) => Promise<void>;
    fetchBlog: (id: string) => Promise<void>;
    createBlog: (data: CreateBlogData) => Promise<Blog | null>;
    updateBlog: (id: string, data: Partial<CreateBlogData>) => Promise<Blog | null>;
    deleteBlog: (id: string) => Promise<boolean>;
    exportBlog: (id: string, format: 'markdown' | 'html' | 'wordpress') => Promise<string | null>;
    generateOutline: (data: GenerateOutlineData) => Promise<OutlineResponse | null>;
    generateContent: (data: GenerateContentData) => Promise<{ content: string; word_count: number } | null>;
    analyzeSeo: (data: AnalyzeSeoData) => Promise<SeoAnalysisResponse | null>;
    clearError: () => void;
}

export function useBlog(): UseBlogReturn {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => setError(null), []);

    const fetchBlogs = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);

        const response = await api.getBlogs(page);

        if (response.error) {
            setError(response.error.message);
        } else if (response.data) {
            setBlogs(response.data.data);
        }

        setIsLoading(false);
    }, []);

    const fetchBlog = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);

        const response = await api.getBlog(id);

        if (response.error) {
            setError(response.error.message);
        } else if (response.data) {
            setCurrentBlog(response.data.blog);
        }

        setIsLoading(false);
    }, []);

    const createBlog = useCallback(async (data: CreateBlogData): Promise<Blog | null> => {
        setIsLoading(true);
        setError(null);

        const response = await api.createBlog(data);

        if (response.error) {
            setError(response.error.message);
            setIsLoading(false);
            return null;
        }

        if (response.data) {
            setBlogs(prev => [response.data!.blog, ...prev]);
            setCurrentBlog(response.data.blog);
            setIsLoading(false);
            return response.data.blog;
        }

        setIsLoading(false);
        return null;
    }, []);

    const updateBlog = useCallback(async (id: string, data: Partial<CreateBlogData>): Promise<Blog | null> => {
        setIsLoading(true);
        setError(null);

        const response = await api.updateBlog(id, data);

        if (response.error) {
            setError(response.error.message);
            setIsLoading(false);
            return null;
        }

        if (response.data) {
            setBlogs(prev => prev.map(b => b.id === id ? response.data!.blog : b));
            setCurrentBlog(response.data.blog);
            setIsLoading(false);
            return response.data.blog;
        }

        setIsLoading(false);
        return null;
    }, []);

    const deleteBlog = useCallback(async (id: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        const response = await api.deleteBlog(id);

        if (response.error) {
            setError(response.error.message);
            setIsLoading(false);
            return false;
        }

        setBlogs(prev => prev.filter(b => b.id !== id));
        if (currentBlog?.id === id) {
            setCurrentBlog(null);
        }

        setIsLoading(false);
        return true;
    }, [currentBlog?.id]);

    const exportBlog = useCallback(async (id: string, format: 'markdown' | 'html' | 'wordpress'): Promise<string | null> => {
        setIsLoading(true);
        setError(null);

        const response = await api.exportBlog(id, format);

        if (response.error) {
            setError(response.error.message);
            setIsLoading(false);
            return null;
        }

        setIsLoading(false);
        return response.data?.content ?? null;
    }, []);

    const generateOutline = useCallback(async (data: GenerateOutlineData): Promise<OutlineResponse | null> => {
        setIsLoading(true);
        setError(null);

        const response = await api.generateOutline(data);

        if (response.error) {
            setError(response.error.message);
            setIsLoading(false);
            return null;
        }

        setIsLoading(false);
        return response.data?.data ?? null;
    }, []);

    const generateContent = useCallback(async (data: GenerateContentData) => {
        setIsLoading(true);
        setError(null);

        const response = await api.generateContent(data);

        if (response.error) {
            setError(response.error.message);
            setIsLoading(false);
            return null;
        }

        setIsLoading(false);
        return response.data?.data ?? null;
    }, []);

    const analyzeSeo = useCallback(async (data: AnalyzeSeoData): Promise<SeoAnalysisResponse | null> => {
        setIsLoading(true);
        setError(null);

        const response = await api.analyzeSeo(data);

        if (response.error) {
            setError(response.error.message);
            setIsLoading(false);
            return null;
        }

        setIsLoading(false);
        return response.data?.data ?? null;
    }, []);

    return {
        blogs,
        currentBlog,
        isLoading,
        error,
        fetchBlogs,
        fetchBlog,
        createBlog,
        updateBlog,
        deleteBlog,
        exportBlog,
        generateOutline,
        generateContent,
        analyzeSeo,
        clearError,
    };
}

export default useBlog;
