'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api, { User, UserPreferences } from './api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    updatePreferences: (preferences: UserPreferences) => Promise<{ success: boolean; error?: string }>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const token = api.getToken();
            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            const response = await api.getUser();
            if (response.data?.user) {
                setUser(response.data.user);
            } else {
                api.setToken(null);
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.login({ email, password });

        if (response.error) {
            return { success: false, error: response.error.message };
        }

        if (response.data?.user) {
            setUser(response.data.user);
            return { success: true };
        }

        return { success: false, error: 'Login failed' };
    };

    const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
        const response = await api.register({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
        });

        if (response.error) {
            return {
                success: false,
                error: response.error.errors
                    ? Object.values(response.error.errors).flat().join('. ')
                    : response.error.message
            };
        }

        if (response.data?.token) {
            api.setToken(response.data.token);
            setUser(response.data.user);
            return { success: true };
        }

        return { success: false, error: 'Registration failed' };
    };

    const logout = async () => {
        await api.logout();
        setUser(null);
    };

    const updatePreferences = async (preferences: UserPreferences) => {
        const response = await api.updatePreferences(preferences);

        if (response.error) {
            return { success: false, error: response.error.message };
        }

        if (user) {
            setUser({ ...user, preferences });
        }

        return { success: true };
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                updatePreferences,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthProvider;
