"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { updateStudentProfile, updateUserProfile } from "@/lib/firebase/profile";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Student } from "@/types";

interface StudentProfileForm {
    displayName: string;
    grade: string;
    targetExam: string;
    subjects: string; // Comma separated
}

export default function StudentProfilePage() {
    const { user, userData } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<StudentProfileForm>();

    useEffect(() => {
        async function loadProfile() {
            if (!user) return;
            try {
                // Fetch student specific data
                const studentRef = doc(db, "students", user.uid);
                const studentSnap = await getDoc(studentRef);
                
                if (studentSnap.exists()) {
                    const studentData = studentSnap.data() as Student;
                    reset({
                        displayName: userData?.displayName || "",
                        grade: studentData.grade || "",
                        targetExam: studentData.targetExam || "",
                        subjects: studentData.subjects?.join(", ") || ""
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

    const onSubmit = async (data: StudentProfileForm) => {
        if (!user) return;
        setSaving(true);
        setMessage(null);

        try {
            // 1. Update User (DisplayName)
            await updateUserProfile(user.uid, {
                displayName: data.displayName
            });

            // 2. Update Student Data
            await updateStudentProfile(user.uid, {
                grade: data.grade,
                targetExam: data.targetExam,
                subjects: data.subjects.split(",").map(s => s.trim()).filter(s => s.length > 0)
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
        <ProtectedRoute requiredRole="student">
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container-custom max-w-3xl">
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil Düzenle</h1>
                        
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
                            </div>

                            {/* Akademik Hedefler */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Akademik Hedefler</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sınıf / Seviye</label>
                                        <select
                                            {...register("grade", { required: "Sınıf seçimi zorunludur" })}
                                            className="input w-full"
                                        >
                                            <option value="">Seçiniz</option>
                                            <option value="9">9. Sınıf</option>
                                            <option value="10">10. Sınıf</option>
                                            <option value="11">11. Sınıf</option>
                                            <option value="12">12. Sınıf</option>
                                            <option value="mezun">Mezun</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Sınav</label>
                                        <select
                                            {...register("targetExam", { required: "Hedef sınav seçimi zorunludur" })}
                                            className="input w-full"
                                        >
                                            <option value="">Seçiniz</option>
                                            <option value="YKS">YKS (TYT/AYT)</option>
                                            <option value="LGS">LGS</option>
                                            <option value="KPSS">KPSS</option>
                                            <option value="DGS">DGS</option>
                                            <option value="ALES">ALES</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">İlgilendiğiniz Dersler (Virgülle ayırın)</label>
                                    <input
                                        {...register("subjects")}
                                        className="input w-full"
                                        placeholder="Örn: Matematik, Fizik, Türkçe"
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
