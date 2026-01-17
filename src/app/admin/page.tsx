"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { seedCoaches } from "@/lib/firebase/seed";

export default function AdminPage() {
    const [seeding, setSeeding] = useState(false);

    const handleSeed = async () => {
        if (confirm("Örnek veriler eklenecek. Emin misiniz?")) {
            setSeeding(true);
            await seedCoaches();
            setSeeding(false);
            alert("Veriler eklendi!");
        }
    };

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Genel Bakış</h2>
                    <button 
                        onClick={handleSeed}
                        disabled={seeding}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50"
                    >
                        {seeding ? "Ekleniyor..." : "🛠️ Örnek Veri Ekle"}
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Toplam Kullanıcı</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
                        <span className="text-green-500 text-sm font-medium">↑ %12 artış</span>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Aktif Koçlar</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">45</p>
                        <span className="text-green-500 text-sm font-medium">↑ 3 yeni başvuru</span>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Aylık Ciro</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">₺45,200</p>
                        <span className="text-green-500 text-sm font-medium">↑ %8 artış</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Son Aktiviteler</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        👤
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Yeni üye kaydı</p>
                                        <p className="text-sm text-gray-500">Ahmet Yılmaz sisteme kayıt oldu</p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-400">2 saat önce</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
