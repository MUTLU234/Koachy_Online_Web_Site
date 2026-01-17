"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
    listenToCoachAppointments,
    listenToStudentAppointments,
    updateAppointmentStatus,
    cancelAppointment,
    hideAppointment
} from "@/lib/firebase/appointments";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Appointment, User, AppointmentStatus } from "@/types";

interface AppointmentWithUser extends Appointment {
    otherParty?: User;
}

export default function AppointmentList({ role }: { role: 'coach' | 'student' }) {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<AppointmentWithUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [actioningId, setActioningId] = useState<string | null>(null);
    const [cancelingId, setCancelingId] = useState<string | null>(null);
    const [cancelReason, setCancelReason] = useState("");
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (!user) return;

        // Real-time listener
        const unsubscribe = role === 'coach'
            ? listenToCoachAppointments(user.uid, handleAppointmentsUpdate)
            : listenToStudentAppointments(user.uid, handleAppointmentsUpdate);

        return () => unsubscribe();
    }, [user, role]);

    async function handleAppointmentsUpdate(data: Appointment[]) {
        // Filter out hidden appointments
        const visibleAppointments = data.filter(app =>
            !app.hiddenFrom || !app.hiddenFrom.includes(user!.uid)
        );

        // Fetch details for the other party
        const enrichedData = await Promise.all(visibleAppointments.map(async (app) => {
            const otherUserId = role === 'coach' ? app.studentId : app.coachId;
            const userRef = doc(db, "users", otherUserId);
            const userSnap = await getDoc(userRef);
            return {
                ...app,
                otherParty: userSnap.exists() ? userSnap.data() as User : undefined
            };
        }));

        setAppointments(enrichedData);
        setLoading(false);
    }

    const handleStatusUpdate = async (appointmentId: string, status: AppointmentStatus) => {
        if (!user) return;
        setActioningId(appointmentId);
        setMessage(null);

        try {
            await updateAppointmentStatus(appointmentId, status, user.uid);
            setMessage({
                type: 'success',
                text: status === 'confirmed' ? 'Randevu onaylandı!' : 'Randevu reddedildi.'
            });
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'İşlem başarısız oldu.' });
        } finally {
            setActioningId(null);
        }
    };

    const handleCancel = async (appointmentId: string) => {
        if (!user) return;
        setActioningId(appointmentId);
        setMessage(null);

        try {
            await cancelAppointment(appointmentId, user.uid, cancelReason);
            setMessage({ type: 'success', text: 'Randevu iptal edildi.' });
            setCancelingId(null);
            setCancelReason("");
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'İptal başarısız oldu.' });
        } finally {
            setActioningId(null);
        }
    };

    const handleHide = async (appointmentId: string) => {
        if (!user) return;
        setActioningId(appointmentId);

        try {
            await hideAppointment(appointmentId, user.uid);
            setMessage({ type: 'success', text: 'Randevu gizlendi.' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Gizleme başarısız oldu.' });
        } finally {
            setActioningId(null);
        }
    };

    if (loading) return <div className="text-center py-4">Yükleniyor...</div>;

    // Group appointments by status
    const pending = appointments.filter(app => app.status === 'pending');
    const confirmed = appointments.filter(app => app.status === 'confirmed');
    const cancelled = appointments.filter(app => app.status === 'cancelled');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Onaylandı</span>;
            case 'pending':
                return <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Bekliyor</span>;
            case 'cancelled':
                return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">İptal</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">{status}</span>;
        }
    };

    const renderAppointment = (appointment: AppointmentWithUser) => (
        <li key={appointment.id}>
            <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                {appointment.otherParty?.displayName?.charAt(0) || "?"}
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-sm font-medium text-indigo-600 truncate">
                                {appointment.otherParty?.displayName || "Bilinmeyen Kullanıcı"}
                            </p>
                            <p className="flex items-center text-sm text-gray-500">
                                {role === 'coach' ? 'Öğrenci' : 'Koç'}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                {appointment.datetime.toDate().toLocaleDateString('tr-TR', {
                                    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex flex-col items-end gap-2">
                        {getStatusBadge(appointment.status)}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {/* Coach: Approve/Reject for pending */}
                            {role === 'coach' && appointment.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleStatusUpdate(appointment.id!, 'confirmed')}
                                        disabled={actioningId === appointment.id}
                                        className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {actioningId === appointment.id ? '...' : '✓ Onayla'}
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(appointment.id!, 'cancelled')}
                                        disabled={actioningId === appointment.id}
                                        className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {actioningId === appointment.id ? '...' : '✗ Reddet'}
                                    </button>
                                </>
                            )}

                            {/* Cancel button for both (pending or confirmed only) */}
                            {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                                <button
                                    onClick={() => setCancelingId(appointment.id!)}
                                    disabled={actioningId === appointment.id}
                                    className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                >
                                    İptal Et
                                </button>
                            )}

                            {/* Hide button for cancelled */}
                            {appointment.status === 'cancelled' && (
                                <button
                                    onClick={() => handleHide(appointment.id!)}
                                    disabled={actioningId === appointment.id}
                                    className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                    title="Listeden gizle"
                                >
                                    🗑️ Gizle
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Appointment Notes */}
                {appointment.notes && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs font-semibold text-blue-900 mb-1">Randevu Notu:</p>
                        <p className="text-sm text-blue-800 italic">
                            "{appointment.notes}"
                        </p>
                    </div>
                )}

                {/* Cancel Reason (for cancelled appointments) */}
                {appointment.status === 'cancelled' && appointment.cancelReason && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-xs font-semibold text-red-900 mb-1">İptal Nedeni:</p>
                        <p className="text-sm text-red-800 italic">
                            "{appointment.cancelReason}"
                        </p>
                        {appointment.cancelledBy && (
                            <p className="text-xs text-red-600 mt-1">
                                {appointment.cancelledBy === user?.uid
                                    ? 'Siz iptal ettiniz'
                                    : `${role === 'coach' ? 'Öğrenci' : 'Koç'} iptal etti`}
                            </p>
                        )}
                    </div>
                )}

                {/* Cancel Dialog */}
                {cancelingId === appointment.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Randevuyu İptal Et
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                            İptal nedeninizi yazabilirsiniz (opsiyonel):
                        </p>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            rows={2}
                            placeholder="İptal nedeni..."
                        />
                        <div className="mt-3 flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setCancelingId(null);
                                    setCancelReason("");
                                }}
                                className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Vazgeç
                            </button>
                            <button
                                onClick={() => handleCancel(appointment.id!)}
                                disabled={actioningId === appointment.id}
                                className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                {actioningId === appointment.id ? 'İptal ediliyor...' : 'Onayla ve İptal Et'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </li>
    );

    const renderSection = (title: string, appointmentList: AppointmentWithUser[], emptyText: string, bgColor: string) => (
        <div className="mb-6">
            <h3 className={`text-sm font-bold mb-3 px-2 py-1 rounded ${bgColor}`}>
                {title} ({appointmentList.length})
            </h3>
            {appointmentList.length === 0 ? (
                <div className="text-center py-4 bg-gray-50 rounded-lg text-gray-500 text-sm">
                    {emptyText}
                </div>
            ) : (
                <div className="overflow-hidden bg-white shadow sm:rounded-md">
                    <ul role="list" className="divide-y divide-gray-200">
                        {appointmentList.map(renderAppointment)}
                    </ul>
                </div>
            )}
        </div>
    );

    if (appointments.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg text-gray-500">
                Henüz randevunuz bulunmamaktadır.
            </div>
        );
    }

    return (
        <div>
            {/* Success/Error Message */}
            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            {/* Pending Appointments */}
            {renderSection(
                "⏳ Onay Bekleyenler",
                pending,
                "Bekleyen randevu yok",
                "bg-yellow-100 text-yellow-800"
            )}

            {/* Confirmed Appointments */}
            {renderSection(
                "✅ Onaylananlar",
                confirmed,
                "Onaylanmış randevu yok",
                "bg-green-100 text-green-800"
            )}

            {/* Cancelled Appointments */}
            {renderSection(
                "❌ İptal Edilenler",
                cancelled,
                "İptal edilmiş randevu yok",
                "bg-red-100 text-red-800"
            )}
        </div>
    );
}
