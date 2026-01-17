"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { getCoachSchedule, updateCoachSchedule } from "@/lib/firebase/schedule";
import type { CoachSchedule, TimeSlot } from "@/types";
import Link from "next/link";

const DAYS = [
    { key: "monday", label: "Pazartesi" },
    { key: "tuesday", label: "Salı" },
    { key: "wednesday", label: "Çarşamba" },
    { key: "thursday", label: "Perşembe" },
    { key: "friday", label: "Cuma" },
    { key: "saturday", label: "Cumartesi" },
    { key: "sunday", label: "Pazar" },
];

const DEFAULT_SCHEDULE: CoachSchedule = DAYS.reduce((acc, day) => {
    acc[day.key] = { available: false, slots: [] };
    return acc;
}, {} as CoachSchedule);

export default function CoachCalendarPage() {
    const { user } = useAuth();
    const [schedule, setSchedule] = useState<CoachSchedule>(DEFAULT_SCHEDULE);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        async function loadSchedule() {
            if (!user) return;
            try {
                const data = await getCoachSchedule(user.uid);
                if (data) {
                    // Merge with default to ensure all days exist
                    setSchedule({ ...DEFAULT_SCHEDULE, ...data });
                }
            } catch (error) {
                console.error("Takvim yüklenirken hata:", error);
                setMessage({ type: 'error', text: "Takvim yüklenemedi." });
            } finally {
                setLoading(false);
            }
        }
        loadSchedule();
    }, [user]);

    const handleDayToggle = (dayKey: string) => {
        setSchedule(prev => ({
            ...prev,
            [dayKey]: {
                ...prev[dayKey],
                available: !prev[dayKey].available
            }
        }));
    };

    const addTimeSlot = (dayKey: string) => {
        setSchedule(prev => ({
            ...prev,
            [dayKey]: {
                ...prev[dayKey],
                slots: [...prev[dayKey].slots, { startTime: "09:00", endTime: "10:00", isBooked: false }]
            }
        }));
    };

    const removeTimeSlot = (dayKey: string, index: number) => {
        setSchedule(prev => {
            const newSlots = [...prev[dayKey].slots];
            newSlots.splice(index, 1);
            return {
                ...prev,
                [dayKey]: {
                    ...prev[dayKey],
                    slots: newSlots
                }
            };
        });
    };

    const updateTimeSlot = (dayKey: string, index: number, field: 'startTime' | 'endTime', value: string) => {
        setSchedule(prev => {
            const newSlots = [...prev[dayKey].slots];
            newSlots[index] = { ...newSlots[index], [field]: value };
            return {
                ...prev,
                [dayKey]: {
                    ...prev[dayKey],
                    slots: newSlots
                }
            };
        });
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        setMessage(null);
        try {
            await updateCoachSchedule(user.uid, schedule);
            setMessage({ type: 'success', text: "Takvim başarıyla güncellendi!" });
        } catch (error) {
            console.error("Kaydetme hatası:", error);
            setMessage({ type: 'error', text: "Takvim kaydedilirken bir hata oluştu." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;

    return (
        <ProtectedRoute requiredRole="coach">
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container-custom max-w-4xl">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Müsaitlik Takvimi</h1>
                        <Link href="/profil/koc" className="text-indigo-600 hover:text-indigo-800 font-medium">
                            &larr; Profil Bilgilerine Dön
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-8">
                        {message && (
                            <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
                                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-6">
                            {DAYS.map((day) => (
                                <div key={day.key} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`toggle-${day.key}`}
                                                checked={schedule[day.key]?.available}
                                                onChange={() => handleDayToggle(day.key)}
                                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={`toggle-${day.key}`} className="ml-3 text-lg font-medium text-gray-900">
                                                {day.label}
                                            </label>
                                        </div>
                                        {schedule[day.key]?.available && (
                                            <button
                                                onClick={() => addTimeSlot(day.key)}
                                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                            >
                                                + Saat Ekle
                                            </button>
                                        )}
                                    </div>

                                    {schedule[day.key]?.available && (
                                        <div className="space-y-3 pl-8">
                                            {schedule[day.key].slots.length === 0 && (
                                                <p className="text-sm text-gray-500 italic">Henüz saat aralığı eklenmedi.</p>
                                            )}
                                            {schedule[day.key].slots.map((slot, index) => (
                                                <div key={index} className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="time"
                                                            value={slot.startTime}
                                                            onChange={(e) => updateTimeSlot(day.key, index, 'startTime', e.target.value)}
                                                            className="input py-1 px-2 text-sm"
                                                        />
                                                        <span className="text-gray-500">-</span>
                                                        <input
                                                            type="time"
                                                            value={slot.endTime}
                                                            onChange={(e) => updateTimeSlot(day.key, index, 'endTime', e.target.value)}
                                                            className="input py-1 px-2 text-sm"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => removeTimeSlot(day.key, index)}
                                                        className="text-red-500 hover:text-red-700 text-sm"
                                                    >
                                                        Sil
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-8">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="btn-primary min-w-[150px]"
                            >
                                {saving ? "Kaydediliyor..." : "Takvimi Kaydet"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
