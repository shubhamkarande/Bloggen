// API Client for Bloggen Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  status: number;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: {
            message: data.message || 'An error occurred',
            errors: data.errors,
          },
          status: response.status,
        };
      }

      return { data, status: response.status };
    } catch (error) {
      return {
        error: { message: 'Network error. Please check your connection.' },
        status: 0,
      };
    }
  }

  // Auth endpoints
  async register(data: { name: string; email: string; password: string; password_confirmation: string; preferences?: object }) {
    return this.request<{ user: User; token: string }>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    const response = await this.request<{ user: User; token: string }>('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    const response = await this.request('/logout', { method: 'POST' });
    this.setToken(null);
    return response;
  }

  async getUser() {
    return this.request<{ user: User }>('/user');
  }

  async updatePreferences(preferences: UserPreferences) {
    return this.request<{ preferences: UserPreferences }>('/user/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences }),
    });
  }

  // Blog endpoints
  async getBlogs(page = 1) {
    return this.request<PaginatedResponse<Blog>>(`/blogs?page=${page}`);
  }

  async getBlog(id: string) {
    return this.request<{ blog: Blog }>(`/blogs/${id}`);
  }

  async createBlog(data: CreateBlogData) {
    return this.request<{ blog: Blog }>('/blogs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBlog(id: string, data: Partial<CreateBlogData>) {
    return this.request<{ blog: Blog }>(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBlog(id: string) {
    return this.request(`/blogs/${id}`, { method: 'DELETE' });
  }

  async exportBlog(id: string, format: 'markdown' | 'html' | 'wordpress') {
    return this.request<{ format: string; content: string }>(`/blogs/${id}/export`, {
      method: 'POST',
      body: JSON.stringify({ format }),
    });
  }

  // AI endpoints
  async generateOutline(data: GenerateOutlineData) {
    return this.request<{ data: OutlineResponse; tokens_used: number }>('/ai/generate-outline', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateContent(data: GenerateContentData) {
    return this.request<{ data: ContentResponse; tokens_used: number }>('/ai/generate-content', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async analyzeSeo(data: AnalyzeSeoData) {
    return this.request<{ data: SeoAnalysisResponse; tokens_used: number }>('/ai/seo-analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async rewriteContent(data: RewriteData) {
    return this.request<{ data: RewriteResponse; tokens_used: number }>('/ai/rewrite', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async expandContent(data: ExpandData) {
    return this.request<{ data: ExpandResponse; tokens_used: number }>('/ai/expand', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin endpoints
  async getAdminDashboard() {
    return this.request<AdminDashboardData>('/admin/dashboard');
  }

  async getAdminUsers(page = 1) {
    return this.request<PaginatedResponse<User>>(`/admin/users?page=${page}`);
  }

  async getAiUsage() {
    return this.request<AiUsageData>('/admin/ai-usage');
  }
}

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'writer' | 'admin';
  preferences?: UserPreferences;
  created_at: string;
}

export interface UserPreferences {
  niches?: string[];
  audience?: string;
  tone?: 'professional' | 'casual' | 'technical' | 'storytelling';
}

export interface Blog {
  id: string;
  user_id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  seo_score: number;
  reading_time: number;
  tags: string[];
  category?: string;
  seo_metadata?: SeoMetadata;
  created_at: string;
  updated_at: string;
}

export interface SeoMetadata {
  id: string;
  blog_id: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  keyword_density?: number;
  readability_score?: number;
}

export interface CreateBlogData {
  title: string;
  content?: string;
  status?: 'draft' | 'published';
  tags?: string[];
  category?: string;
  seo_score?: number;
  seo_metadata?: Partial<SeoMetadata>;
}

export interface GenerateOutlineData {
  topic: string;
  keywords?: string[];
  audience?: string;
  tone?: string;
  word_count?: number;
  seo_focus?: 'google' | 'medium' | 'devto';
}

export interface OutlineResponse {
  title_options: string[];
  outline: { level: string; text: string }[];
  estimated_word_count: number;
}

export interface GenerateContentData {
  outline: { level: string; text: string }[];
  title: string;
  keywords?: string[];
  tone?: string;
  word_count?: number;
}

export interface ContentResponse {
  content: string;
  word_count: number;
  reading_time: number;
}

export interface AnalyzeSeoData {
  title: string;
  content: string;
  keywords?: string[];
}

export interface SeoAnalysisResponse {
  seo_score: number;
  meta_title: string;
  meta_description: string;
  keywords: string[];
  keyword_density: number;
  readability_score: number;
  suggestions: string[];
}

export interface RewriteData {
  content: string;
  tone?: string;
  goal?: string;
}

export interface RewriteResponse {
  rewritten_content: string;
  changes_made: string[];
}

export interface ExpandData {
  content: string;
  additional_words?: number;
}

export interface ExpandResponse {
  expanded_content: string;
  added_word_count: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface AdminDashboardData {
  stats: {
    total_users: number;
    total_blogs: number;
    published_blogs: number;
    total_tokens_used: number;
  };
  recent_blogs: { id: string; title: string; status: string; created_at: string; author: string }[];
  recent_users: User[];
}

export interface AiUsageData {
  total_requests: number;
  total_tokens: number;
  usage_by_action: { action: string; count: number; total_tokens: number }[];
  daily_usage: { date: string; requests: number; tokens: number }[];
  top_users: { user_id: string; total_tokens: number; request_count: number; user: User }[];
}

export const api = new ApiClient();
export default api;
