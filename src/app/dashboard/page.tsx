"use client";

/**
 * Dashboard (Ana Sayfa - Giriş Yapmış Kullanıcılar İçin)
 */

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import CoachDashboard from "@/components/dashboard/CoachDashboard";

function DashboardContent() {
    const { user, userData, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push("/giris");
        } catch (error) {
            console.error("Çıkış hatası:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container-custom py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-display font-bold text-indigo-600">
                        Koachy
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-medium text-gray-900">{userData?.displayName}</p>
                            <p className="text-xs text-gray-500 capitalize">
                                {userData?.role === 'student' ? 'Öğrenci' : userData?.role === 'coach' ? 'Koç' : 'Admin'}
                            </p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="btn-secondary text-sm py-2 px-4"
                        >
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container-custom py-8">
                {!user?.emailVerified && (
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-8 rounded-r-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-orange-700">
                                    Hesabınızın güvenliği için lütfen email adresinizi doğrulayın.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {userData?.role === 'student' && <StudentDashboard />}
                {userData?.role === 'coach' && <CoachDashboard />}
                {userData?.role === 'admin' && (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-900">Admin Paneli</h2>
                        <p className="text-gray-600 mt-2">Admin paneline erişmek için aşağıdaki butonu kullanın.</p>
                        <button 
                            onClick={() => router.push('/admin/cms')}
                            className="btn-primary mt-4"
                        >
                            CMS Yönetimi
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}
