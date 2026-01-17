"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getCoachById, type CoachWithUser } from "@/lib/firebase/coaches";
import { createAppointment, getCoachAppointments } from "@/lib/firebase/appointments";
import type { Appointment, TimeSlot } from "@/types";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Helper to get day key (monday, tuesday...)
const getDayKey = (date: Date) => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[date.getDay()];
};

// Helper to format date (25 Aralık Pzt)
const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' });
};

export default function CoachDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user, userData } = useAuth();
    const router = useRouter();

    const [coach, setCoach] = useState<CoachWithUser | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [bookingSlot, setBookingSlot] = useState<{ date: Date, slot: TimeSlot } | null>(null);
    const [bookingNote, setBookingNote] = useState("");
    const [isBooking, setIsBooking] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Generate next 14 days
    const calendarDays = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    useEffect(() => {
        async function loadData() {
            try {
                const [coachData, appointmentsData] = await Promise.all([
                    getCoachById(id),
                    getCoachAppointments(id)
                ]);
                setCoach(coachData);
                setAppointments(appointmentsData);
            } catch (error) {
                console.error("Veri yükleme hatası:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id]);

    const getAvailableSlotsForDate = (date: Date) => {
        if (!coach || !coach.schedule) return [];

        const dayKey = getDayKey(date);
        const daySchedule = coach.schedule[dayKey];

        if (!daySchedule || !daySchedule.available) return [];

        // Filter out past slots if date is today
        const now = new Date();
        const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth();

        return daySchedule.slots.filter(slot => {
            // Check if slot is already booked in appointments
            // This is a simplified check. In production, you'd compare timestamps more precisely.
            // Here we assume the slot.startTime matches the appointment time string if we were to format it.
            // But appointments have Timestamp. We need to convert appointment timestamp to HH:mm to compare.

            const isBooked = appointments.some(app => {
                const appDate = app.datetime.toDate();
                const appTime = appDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

                // Check if appointment is on the same day
                const sameDay = appDate.getDate() === date.getDate() &&
                    appDate.getMonth() === date.getMonth() &&
                    appDate.getFullYear() === date.getFullYear();

                return sameDay && appTime === slot.startTime && (app.status === 'pending' || app.status === 'confirmed');
            });

            if (isBooked) return false;

            if (isToday) {
                const [hours, minutes] = slot.startTime.split(':').map(Number);
                const slotTime = new Date(date);
                slotTime.setHours(hours, minutes, 0, 0);
                if (slotTime < now) return false;
            }

            return true;
        });
    };

    const handleBookClick = (date: Date, slot: TimeSlot) => {
        if (!user) {
            router.push(`/auth/giris?redirect=/koclar/${id}`);
            return;
        }
        if (userData?.role !== 'student') {
            setMessage({ type: 'error', text: "Sadece öğrenciler randevu alabilir." });
            return;
        }
        setBookingSlot({ date, slot });
        setMessage(null);
    };

    const confirmBooking = async () => {
        if (!bookingSlot || !user) return;
        setIsBooking(true);

        try {
            // Construct the full Date object for the appointment
            const [hours, minutes] = bookingSlot.slot.startTime.split(':').map(Number);
            const appointmentDate = new Date(bookingSlot.date);
            appointmentDate.setHours(hours, minutes, 0, 0);

            // CRITICAL: Use coach.userId (not coaches document ID) for coachId
            // This ensures the query in AppointmentList matches correctly
            if (!coach?.userId) {
                throw new Error("Koç bilgisi bulunamadı");
            }
            await createAppointment(user.uid, coach.userId, appointmentDate, 60, bookingNote);

            setMessage({ type: 'success', text: "Randevu talebiniz başarıyla oluşturuldu!" });
            setBookingSlot(null);
            setBookingNote("");

            // Refresh appointments to update UI
            const newApps = await getCoachAppointments(id);
            setAppointments(newApps);
        } catch (error) {
            console.error("Randevu hatası:", error);
            setMessage({ type: 'error', text: "Randevu oluşturulurken bir hata oluştu." });
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) return <div className="p-12 text-center">Yükleniyor...</div>;
    if (!coach) return <div className="p-12 text-center">Koç bulunamadı.</div>;

    const availableSlots = getAvailableSlotsForDate(selectedDate);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom">
                {/* Header / Profile Info */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-32 h-32 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                            {coach.user.profilePicUrl ? (
                                <img src={coach.user.profilePicUrl} alt={coach.user.displayName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                                    {coach.user.displayName?.charAt(0) || "K"}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{coach.user.displayName}</h1>
                            <p className="text-indigo-600 font-medium mb-4">{coach.specialties.join(" • ")}</p>
                            <p className="text-gray-600 mb-6">{coach.bio}</p>

                            <div className="flex gap-6 text-sm text-gray-500">
                                <div>
                                    <span className="font-bold text-gray-900">{coach.experience} Yıl</span> Deneyim
                                </div>
                                <div>
                                    <span className="font-bold text-gray-900">⭐ {coach.rating}</span> ({coach.totalReviews} Değerlendirme)
                                </div>
                                <div>
                                    <span className="font-bold text-gray-900">{coach.hourlyRate} ₺</span> / Saat
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6">
                                {user && userData?.role === 'student' && (
                                    <Link
                                        href={`/mesajlar?coachId=${id}`}
                                        className="btn-secondary flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        Mesaj Gönder
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Randevu Al</h2>

                        {message && (
                            <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        {/* Date Selector */}
                        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                            {calendarDays.map((date, index) => {
                                const isSelected = date.toDateString() === selectedDate.toDateString();
                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDate(date)}
                                        className={`flex-shrink-0 w-24 p-3 rounded-xl border transition-all text-center ${isSelected
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                            : 'border-gray-200 hover:border-indigo-300'
                                            }`}
                                    >
                                        <div className="text-xs font-medium uppercase mb-1 opacity-70">
                                            {date.toLocaleDateString('tr-TR', { weekday: 'short' })}
                                        </div>
                                        <div className="text-lg font-bold">
                                            {date.getDate()} {date.toLocaleDateString('tr-TR', { month: 'short' })}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Slots */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-4">
                                {formatDate(selectedDate)} için Müsait Saatler
                            </h3>

                            {availableSlots.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {availableSlots.map((slot, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleBookClick(selectedDate, slot)}
                                            className="py-2 px-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700 font-medium transition-colors"
                                        >
                                            {slot.startTime}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-xl text-gray-500">
                                    Bu tarih için uygun saat bulunmamaktadır.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Confirmation Modal / Sidebar */}
                    <div className="lg:col-span-1">
                        {bookingSlot ? (
                            <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-indigo-100 sticky top-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Randevu Onayı</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Tarih:</span>
                                        <span className="font-medium text-gray-900">{formatDate(bookingSlot.date)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Saat:</span>
                                        <span className="font-medium text-gray-900">{bookingSlot.slot.startTime} - {bookingSlot.slot.endTime}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Ücret:</span>
                                        <span className="font-medium text-gray-900">{coach.hourlyRate} ₺</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notunuz (Opsiyonel)</label>
                                    <textarea
                                        value={bookingNote}
                                        onChange={(e) => setBookingNote(e.target.value)}
                                        className="input w-full text-sm"
                                        rows={3}
                                        placeholder="Koça iletmek istediğiniz bir not..."
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setBookingSlot(null)}
                                        className="flex-1 btn-secondary py-2 text-sm"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        onClick={confirmBooking}
                                        disabled={isBooking}
                                        className="flex-1 btn-primary py-2 text-sm"
                                    >
                                        {isBooking ? "..." : "Onayla"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-indigo-50 rounded-2xl p-6 text-center">
                                <p className="text-indigo-800 font-medium">
                                    Randevu almak için soldaki takvimden bir saat seçiniz.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
