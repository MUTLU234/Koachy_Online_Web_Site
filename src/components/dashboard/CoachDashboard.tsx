"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppointmentList from "@/components/appointments/AppointmentList";
import { useAuth } from "@/contexts/AuthContext";
import { listenToCoachAppointments } from "@/lib/firebase/appointments";

export default function CoachDashboard() {
    const { userData } = useAuth();
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        if (userData?.uid) {
            const unsubscribe = listenToCoachAppointments(userData.uid, (appointments) => {
                const pending = appointments.filter(app => app.status === 'pending');
                setPendingCount(pending.length);
            });
            return () => unsubscribe();
        }
    }, [userData?.uid]);

    return (
        <div className="space-y-8">
            {/* Quick Stats / Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                    <h3 className="text-lg font-semibold opacity-90 mb-2">Merhaba,</h3>
                    <p className="text-2xl font-bold mb-4">{userData?.displayName}</p>
                    <div className="flex gap-2">
                        <Link href="/profil/koc" className="inline-block bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
                            Profili Düzenle
                        </Link>
                        <Link href="/profil/koc/takvim" className="inline-block bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
                            Takvim
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-gray-500 font-medium mb-1">Aktif Öğrenciler</h3>
                        <p className="text-3xl font-bold text-gray-900">12</p>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-green-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>Geçen aya göre +2</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-gray-500 font-medium mb-1">Toplam Kazanç (Bu Ay)</h3>
                        <p className="text-3xl font-bold text-gray-900">18.500 ₺</p>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                        <span>Son güncelleme: Bugün</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Appointments */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900">Yaklaşan Randevular</h3>
                                {pendingCount > 0 && (
                                    <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                                        {pendingCount} Bekliyor
                                    </span>
                                )}
                            </div>
                            <Link href="/profil/koc/takvim" className="text-sm text-indigo-600 hover:text-indigo-800">
                                Takvimi Yönet
                            </Link>
                        </div>
                        <AppointmentList role="coach" />
                    </div>
                </div>

                {/* Sidebar / Tasks */}
                <div className="space-y-6">
                    {/* Mesajlar Kartı */}
                    <Link href="/mesajlar" className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900">Mesajlar</h3>
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Öğrencilerinizle mesajlaşın</p>
                        <span className="text-green-600 font-medium text-sm hover:underline">
                            Mesajlara Git →
                        </span>
                    </Link>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Yapılacaklar</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                                <span className="text-sm text-gray-700">Ahmet Y. için gelişim raporu hazırla</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                                <span className="text-sm text-gray-700">Ayşe K. ile deneme analizi</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                                <span className="text-sm text-gray-700">Profil bilgilerini güncelle</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Son Değerlendirmeler</h3>
                        <div className="space-y-4">
                            <div className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm">Mehmet T.</span>
                                    <span className="text-yellow-400 text-xs">⭐⭐⭐⭐⭐</span>
                                </div>
                                <p className="text-xs text-gray-500">"Hocam çok ilgili, netlerimde ciddi artış oldu."</p>
                            </div>
                            <div className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm">Zeynep A.</span>
                                    <span className="text-yellow-400 text-xs">⭐⭐⭐⭐⭐</span>
                                </div>
                                <p className="text-xs text-gray-500">"Planlama konusunda harika."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
