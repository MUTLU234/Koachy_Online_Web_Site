"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileRedirectPage() {
    const { userData, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && userData) {
            if (userData.role === "coach") {
                router.push("/profil/koc");
            } else if (userData.role === "student") {
                router.push("/profil/ogrenci");
            } else if (userData.role === "admin") {
                router.push("/admin");
            }
        }
    }, [userData, loading, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );
}
