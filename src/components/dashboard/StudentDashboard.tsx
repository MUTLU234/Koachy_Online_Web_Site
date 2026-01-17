"use client";

import Link from "next/link";
import AppointmentList from "@/components/appointments/AppointmentList";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentDashboard() {
    const { userData } = useAuth();

    return (
        <div className="space-y-8">
            {/* Quick Stats / Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                    <h3 className="text-lg font-semibold opacity-90 mb-2">Hoş Geldin,</h3>
                    <p className="text-2xl font-bold mb-4">{userData?.displayName}</p>
                    <Link href="/profil/ogrenci" className="inline-block bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
                        Profilimi Düzenle
                    </Link>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-gray-500 font-medium mb-1">Hedef Sınav</h3>
                        <p className="text-2xl font-bold text-gray-900">YKS 2025</p>
                    </div>
                    <div className="mt-4">
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500 text-right">%35 Tamamlandı</p>
                    </div>
                </div>

                <Link href="/mesajlar" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3 relative">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        {/* Okunmamış badge - optional, gerçek veride gösterilecek */}
                        {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">3</span> */}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Mesajlarım</h3>
                    <p className="text-sm text-gray-500 mb-3">Koçlarınızla iletişimde kalın.</p>
                    <span className="text-green-600 font-medium text-sm hover:underline">
                        Mesajlara Git &rarr;
                    </span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Appointments */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Randevularım</h3>
                            <Link href="/koclar" className="text-sm text-indigo-600 hover:text-indigo-800">
                                + Yeni Randevu
                            </Link>
                        </div>
                        <AppointmentList role="student" />
                    </div>
                </div>

                {/* Sidebar / Notifications */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Duyurular</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <div className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm text-gray-800 font-medium">YKS Başvuruları Başladı</p>
                                    <p className="text-xs text-gray-500 mt-1">Son başvuru tarihi 26 Şubat.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm text-gray-800 font-medium">Yeni Deneme Sınavı</p>
                                    <p className="text-xs text-gray-500 mt-1">Türkiye geneli deneme sınavı eklendi.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-50 rounded-2xl p-6">
                        <h3 className="font-bold text-indigo-900 mb-2">Premium'a Geç</h3>
                        <p className="text-sm text-indigo-700 mb-4">
                            Daha fazla özellik ve sınırsız görüşme için paketinizi yükseltin.
                        </p>
                        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                            Paketleri İncele
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
