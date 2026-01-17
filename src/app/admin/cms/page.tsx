"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getSiteContent, updateSiteContent } from "@/lib/firebase/cms";
import { useAuth } from "@/contexts/AuthContext";
import type { SiteContent } from "@/types/cms";

export default function CMSPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<SiteContent>();

    useEffect(() => {
        async function loadContent() {
            try {
                const content = await getSiteContent();
                reset(content);
            } catch (error) {
                console.error("İçerik yüklenemedi:", error);
                setMessage({ type: 'error', text: "İçerik yüklenirken bir hata oluştu." });
            } finally {
                setLoading(false);
            }
        }
        loadContent();
    }, [reset]);

    const onSubmit = async (data: SiteContent) => {
        if (!user) return;
        setSaving(true);
        setMessage(null);

        try {
            await updateSiteContent(data, user.uid);
            setMessage({ type: 'success', text: "İçerik başarıyla güncellendi!" });
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            setMessage({ type: 'error', text: "Güncelleme sırasında bir hata oluştu." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Yükleniyor...</div>;
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">İçerik Yönetimi (CMS)</h2>
                    {message && (
                        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {message.text}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Hero Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Ana Sayfa Hero Alanı</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                                <input
                                    {...register("hero.title", { required: "Başlık zorunludur" })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
                                />
                                {errors.hero?.title && <span className="text-red-500 text-xs">{errors.hero.title.message}</span>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Başlık</label>
                                <input
                                    {...register("hero.subtitle", { required: "Alt başlık zorunludur" })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Buton 1 Metni</label>
                                    <input
                                        {...register("hero.ctaPrimary")}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Buton 2 Metni</label>
                                    <input
                                        {...register("hero.ctaSecondary")}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">İstatistikler</h3>
                        
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Koç Sayısı</label>
                                <input
                                    {...register("stats.coaches")}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Öğrenci Sayısı</label>
                                <input
                                    {...register("stats.students")}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Başarı Oranı</label>
                                <input
                                    {...register("stats.successRate")}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Özellikler</h3>
                        
                        {[0, 1, 2].map((index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                                <h4 className="font-medium text-gray-700">Özellik {index + 1}</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                                    <input
                                        {...register(`features.${index}.title` as const)}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                    <textarea
                                        {...register(`features.${index}.description` as const)}
                                        rows={2}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary min-w-[150px]"
                        >
                            {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                        </button>
                    </div>
                </form>
            </div>
        </ProtectedRoute>
    );
}
