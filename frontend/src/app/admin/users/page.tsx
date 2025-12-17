'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api, { User, PaginatedResponse } from '@/lib/api';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showRoleModal, setShowRoleModal] = useState(false);

    const fetchUsers = async (page: number) => {
        setIsLoading(true);
        const response = await api.getAdminUsers(page);
        if (response.data) {
            const data = response.data as PaginatedResponse<User>;
            setUsers(data.data);
            setCurrentPage(data.current_page);
            setTotalPages(data.last_page);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUsers(1);
    }, []);

    const handleRoleChange = async (userId: string, newRole: 'writer' | 'admin') => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/users/${userId}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            },
            body: JSON.stringify({ role: newRole }),
        });

        if (response.ok) {
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            setShowRoleModal(false);
            setSelectedUser(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold mb-2">User Management</h1>
                <p className="text-[var(--foreground-muted)]">
                    View and manage all registered users
                </p>
            </motion.div>

            {isLoading ? (
                <div className="card">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border-b border-[var(--border)] last:border-0">
                            <div className="skeleton w-10 h-10 rounded-full" />
                            <div className="flex-1">
                                <div className="skeleton h-4 w-32 mb-2" />
                                <div className="skeleton h-3 w-48" />
                            </div>
                            <div className="skeleton h-6 w-16 rounded-full" />
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card overflow-hidden"
                >
                    <table className="w-full">
                        <thead className="bg-[var(--background)]">
                            <tr>
                                <th className="text-left p-4 font-semibold">User</th>
                                <th className="text-left p-4 font-semibold">Role</th>
                                <th className="text-left p-4 font-semibold">Joined</th>
                                <th className="text-right p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-t border-[var(--border)] hover:bg-[var(--background)]/50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-blue)] flex items-center justify-center text-white font-semibold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-[var(--foreground-muted)]">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`badge ${user.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-[var(--foreground-muted)]">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setShowRoleModal(true);
                                            }}
                                            className="btn btn-ghost text-sm"
                                        >
                                            Change Role
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 p-4 border-t border-[var(--border)]">
                            <button
                                onClick={() => fetchUsers(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="btn btn-secondary text-sm disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-[var(--foreground-muted)]">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => fetchUsers(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="btn btn-secondary text-sm disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Role Change Modal */}
            {showRoleModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card max-w-md w-full mx-4"
                    >
                        <h3 className="text-lg font-semibold mb-2">Change User Role</h3>
                        <p className="text-[var(--foreground-muted)] mb-6">
                            Update role for <strong>{selectedUser.name}</strong>
                        </p>
                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={() => handleRoleChange(selectedUser.id, 'writer')}
                                className={`flex-1 p-3 rounded-lg border transition-all ${selectedUser.role === 'writer'
                                        ? 'border-[var(--primary-500)] bg-[var(--primary-500)]/10'
                                        : 'border-[var(--border)] hover:border-[var(--primary-400)]'
                                    }`}
                            >
                                <p className="font-semibold">Writer</p>
                                <p className="text-xs text-[var(--foreground-muted)]">Can create and manage blogs</p>
                            </button>
                            <button
                                onClick={() => handleRoleChange(selectedUser.id, 'admin')}
                                className={`flex-1 p-3 rounded-lg border transition-all ${selectedUser.role === 'admin'
                                        ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10'
                                        : 'border-[var(--border)] hover:border-[var(--accent-gold)]'
                                    }`}
                            >
                                <p className="font-semibold">Admin</p>
                                <p className="text-xs text-[var(--foreground-muted)]">Full platform access</p>
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                setShowRoleModal(false);
                                setSelectedUser(null);
                            }}
                            className="btn btn-secondary w-full"
                        >
                            Cancel
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
