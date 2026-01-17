"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { updateCoachProfile, updateUserProfile } from "@/lib/firebase/profile";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Coach } from "@/types";

interface CoachProfileForm {
    displayName: string;
    bio: string;
    specialties: string; // Comma separated
    hourlyRate: number;
    education: string;
    experience: number;
}

export default function CoachProfilePage() {
    const { user, userData } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CoachProfileForm>();

    useEffect(() => {
        async function loadProfile() {
            if (!user) return;
            try {
                // Fetch coach specific data
                const coachRef = doc(db, "coaches", user.uid);
                const coachSnap = await getDoc(coachRef);
                
                if (coachSnap.exists()) {
                    const coachData = coachSnap.data() as Coach;
                    reset({
                        displayName: userData?.displayName || "",
                        bio: coachData.bio || "",
                        specialties: coachData.specialties.join(", "),
                        hourlyRate: coachData.hourlyRate || 0,
                        education: coachData.education || "",
                        experience: coachData.experience || 0
                    });
                }
            } catch (error) {
                console.error("Profil yüklenirken hata:", error);
            } finally {
                setLoading(false);
            }
        }
        
        if (userData) {
            loadProfile();
        }
    }, [user, userData, reset]);

    const onSubmit = async (data: CoachProfileForm) => {
        if (!user) return;
        setSaving(true);
        setMessage(null);

        try {
            // 1. Update User (DisplayName)
            await updateUserProfile(user.uid, {
                displayName: data.displayName
            });

            // 2. Update Coach Data
            await updateCoachProfile(user.uid, {
                bio: data.bio,
                specialties: data.specialties.split(",").map(s => s.trim()).filter(s => s.length > 0),
                hourlyRate: Number(data.hourlyRate),
                education: data.education,
                experience: Number(data.experience)
            });

            setMessage({ type: 'success', text: "Profiliniz başarıyla güncellendi!" });
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            setMessage({ type: 'error', text: "Profil güncellenirken bir hata oluştu." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Yükleniyor...</div>;
    }

    return (
        <ProtectedRoute requiredRole="coach">
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container-custom max-w-3xl">
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Profil Düzenle</h1>
                            <Link href="/profil/koc/takvim" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                Takvim Yönetimi &rarr;
                            </Link>
                        </div>
                        
                        {message && (
                            <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
                                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Kişisel Bilgiler */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Kişisel Bilgiler</h2>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                                    <input
                                        {...register("displayName", { required: "Ad Soyad zorunludur" })}
                                        className="input w-full"
                                    />
                                    {errors.displayName && <span className="text-red-500 text-xs">{errors.displayName.message}</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Biyografi</label>
                                    <textarea
                                        {...register("bio", { required: "Biyografi zorunludur" })}
                                        rows={4}
                                        className="input w-full"
                                        placeholder="Kendinizden ve deneyimlerinizden bahsedin..."
                                    />
                                    {errors.bio && <span className="text-red-500 text-xs">{errors.bio.message}</span>}
                                </div>
                            </div>

                            {/* Uzmanlık ve Deneyim */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Uzmanlık ve Deneyim</h2>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Uzmanlık Alanları (Virgülle ayırın)</label>
                                    <input
                                        {...register("specialties", { required: "En az bir uzmanlık alanı giriniz" })}
                                        className="input w-full"
                                        placeholder="Örn: Matematik, Geometri, YKS Koçluğu"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Eğitim Durumu</label>
                                        <input
                                            {...register("education", { required: "Eğitim bilgisi zorunludur" })}
                                            className="input w-full"
                                            placeholder="Örn: ODTÜ Matematik Öğretmenliği"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Deneyim (Yıl)</label>
                                        <input
                                            type="number"
                                            {...register("experience", { required: "Deneyim yılı zorunludur", min: 0 })}
                                            className="input w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Ücretlendirme */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Ücretlendirme</h2>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Saatlik Ücret (₺)</label>
                                    <input
                                        type="number"
                                        {...register("hourlyRate", { required: "Saatlik ücret zorunludur", min: 0 })}
                                        className="input w-full"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
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
                </div>
            </div>
        </ProtectedRoute>
    );
}
