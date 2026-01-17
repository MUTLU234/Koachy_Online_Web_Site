'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Navbar() {
    const { user, signOut } = useAuth();

    return (
        <header className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                    >
                        Koachy
                    </Link>

                    {/* Navigation Links & Actions */}
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Auth Buttons */}
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Çıkış Yap
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/giris"
                                    className="px-5 py-2 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    href="/kayit"
                                    className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
                                >
                                    Kayıt Ol
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
