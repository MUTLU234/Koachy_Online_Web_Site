"use client";

/**
 * Protected Route Wrapper
 * 
 * Sadece giriş yapmış kullanıcıların erişebileceği sayfalar için wrapper
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "admin" | "coach" | "student";
}

export default function ProtectedRoute({
    children,
    requiredRole,
}: ProtectedRouteProps) {
    const router = useRouter();
    const { user, userData, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            // Kullanıcı giriş yapmamışsa login'e yönlendir
            if (!user) {
                router.push("/giris");
                return;
            }

            // Rol kontrolü
            if (requiredRole && userData?.role !== requiredRole) {
                router.push("/yetkisiz");
                return;
            }
        }
    }, [user, userData, loading, requiredRole, router]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    // Giriş yapılmamışsa veya rol uyumsuzsa boş döndür (useEffect yönlendirme yapıyor)
    if (!user || (requiredRole && userData?.role !== requiredRole)) {
        return null;
    }

    return <>{children}</>;
}
