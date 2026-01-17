"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { signOut } = useAuth();

    const menuItems = [
        { href: "/admin", label: "Genel Bakış", icon: "📊" },
        { href: "/admin/cms", label: "İçerik Yönetimi", icon: "📝" },
        { href: "/admin/users", label: "Kullanıcılar", icon: "👥" },
        { href: "/admin/coaches", label: "Koç Başvuruları", icon: "🎓" },
        { href: "/admin/payments", label: "Ödemeler", icon: "💳" },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-display font-bold text-indigo-600">
                        Koachy Admin
                    </h1>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? "bg-indigo-50 text-indigo-600 font-medium"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <span>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <span>🚪</span>
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
