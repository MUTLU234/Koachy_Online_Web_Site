import { db } from "./config";
import {
    collection,
    addDoc,
    serverTimestamp,
    Timestamp,
    query,
    where,
    getDocs,
    getDoc,
    orderBy,
    doc,
    updateDoc,
    onSnapshot,
    Unsubscribe
} from "firebase/firestore";
import type { Appointment, AppointmentStatus } from "@/types";
import { getOrCreateConversation, sendMessage } from "./messaging";

/**
 * Yeni randevu oluştur
 */
export async function createAppointment(
    studentId: string,
    coachId: string,
    date: Date,
    duration: number = 60,
    notes?: string
): Promise<string> {
    try {
        // Çakışma kontrolü
        // Basit kontrol: Aynı koçun aynı saatte başka randevusu var mı?
        const startTimestamp = Timestamp.fromDate(date);

        // Not: Firestore'da tam eşitlik kontrolü zor olabilir, aralık kontrolü daha iyi olurdu
        // Ancak şimdilik basitçe aynı başlangıç zamanına bakacağız.
        // Gerçek uygulamada: start < existingEnd && end > existingStart

        const q = query(
            collection(db, "appointments"),
            where("coachId", "==", coachId),
            where("datetime", "==", startTimestamp),
            where("status", "in", ["pending", "confirmed"])
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            throw new Error("Bu saatte koçun başka bir randevusu var.");
        }

        const appointmentData = {
            studentId,
            coachId,
            datetime: startTimestamp,
            duration,
            status: "pending" as AppointmentStatus,
            notes: notes || "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, "appointments"), appointmentData);
        return docRef.id;
    } catch (error) {
        console.error("Randevu oluşturma hatası:", error);
        throw error;
    }
}

/**
 * Koçun randevularını getir
 */
export async function getCoachAppointments(coachId: string): Promise<Appointment[]> {
    try {
        const q = query(
            collection(db, "appointments"),
            where("coachId", "==", coachId),
            orderBy("datetime", "desc")
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
    } catch (error) {
        console.error("Koç randevuları getirme hatası:", error);
        return [];
    }
}

/**
 * Öğrencinin randevularını getir
 */
export async function getStudentAppointments(studentId: string): Promise<Appointment[]> {
    try {
        const q = query(
            collection(db, "appointments"),
            where("studentId", "==", studentId),
            orderBy("datetime", "desc")
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
    } catch (error) {
        console.error("Öğrenci randevuları getirme hatası:", error);
        return [];
    }
}

/**
 * Randevu durumunu güncelle (koç için onaylama/reddetme)
 */
export async function updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus,
    userId: string
): Promise<void> {
    try {
        // Authorization: Sadece koç kendi randevularını güncelleyebilir
        const appointmentRef = doc(db, "appointments", appointmentId);
        const appointmentSnap = await getDoc(appointmentRef); // Use getDoc to fetch a single document

        if (!appointmentSnap.exists()) {
            throw new Error("Randevu bulunamadı.");
        }

        const appointment = appointmentSnap.data() as Appointment;

        if (appointment.coachId !== userId) {
            throw new Error("Bu randevuyu güncelleme yetkiniz yok");
        }

        // Randevu durumunu güncelle
        await updateDoc(appointmentRef, {
            status,
            updatedAt: serverTimestamp()
        });

        // Eğer randevu onaylandıysa, conversation oluştur ve mesaj gönder
        if (status === 'confirmed') {
            await createConversationAndSendWelcomeMessage(
                appointment.coachId,
                appointment.studentId,
                appointmentId
            );
        }
    } catch (error) {
        console.error("Randevu durumu güncelleme hatası:", error);
        throw error;
    }
}

/**
 * Conversation oluştur ve hoşgeldin mesajı gönder
 */
async function createConversationAndSendWelcomeMessage(
    coachId: string,
    studentId: string,
    appointmentId: string
): Promise<void> {
    try {
        // Kullanıcı bilgilerini al
        const coachRef = doc(db, "users", coachId);
        const studentRef = doc(db, "users", studentId);

        const [coachSnap, studentSnap] = await Promise.all([
            getDoc(coachRef), // Use getDoc for single document
            getDoc(studentRef) // Use getDoc for single document
        ]);

        if (!coachSnap.exists() || !studentSnap.exists()) {
            console.error("Kullanıcı bilgileri bulunamadı");
            return;
        }

        const coachData = coachSnap.data();
        const studentData = studentSnap.data();

        console.log("Mesajlaşma: Konuşma oluşturuluyor...", { coachId, studentId });

        // Conversation oluştur veya getir
        const conversationId = await getOrCreateConversation(
            {
                id: studentId,
                name: studentData.displayName || 'Öğrenci',
                photo: studentData.profilePicUrl,
                role: 'student'
            },
            {
                id: coachId,
                name: coachData.displayName || 'Koç',
                photo: coachData.profilePicUrl,
                role: 'coach'
            }
        );

        console.log("Mesajlaşma: Konuşma ID:", conversationId);

        // Hoşgeldin mesajı gönder
        await sendMessage(
            conversationId,
            coachId,
            coachData.displayName || 'Koç',
            `Merhaba! Randevunuzu onayladım. Herhangi bir sorunuz varsa buradan benimle iletişime geçebilirsiniz. 📅`
        );

        console.log("Mesajlaşma: Hoşgeldin mesajı başarıyla gönderildi.");
    } catch (error) {
        console.error("Conversation oluşturma hatası:", error);
        // Hata olsa bile randevu onaylanmış olduğu için throw etmiyoruz
    }
}

/**
 * Randevu iptal et (öğrenci veya koç)
 */
export async function cancelAppointment(
    appointmentId: string,
    userId: string,
    reason?: string
): Promise<void> {
    try {
        // Authorization: Randevunun student veya coach'u olmalı
        const appointmentRef = doc(db, "appointments", appointmentId);
        const appointmentSnap = await getDocs(query(
            collection(db, "appointments"),
            where("__name__", "==", appointmentId)
        ));

        if (appointmentSnap.empty) {
            throw new Error("Randevu bulunamadı");
        }

        const appointment = appointmentSnap.docs[0].data() as Appointment;

        if (appointment.studentId !== userId && appointment.coachId !== userId) {
            throw new Error("Bu randevuyu iptal etme yetkiniz yok");
        }

        await updateDoc(appointmentRef, {
            status: "cancelled" as AppointmentStatus,
            cancelReason: reason || "",
            canceledBy: userId,
            canceledAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Randevu iptal hatası:", error);
        throw error;
    }
}

/**
 * Koçun randevularını real-time dinle
 */
export function listenToCoachAppointments(
    coachId: string,
    callback: (appointments: Appointment[]) => void
): Unsubscribe {
    const q = query(
        collection(db, "appointments"),
        where("coachId", "==", coachId),
        orderBy("datetime", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const appointments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Appointment));
        callback(appointments);
    }, (error) => {
        console.error("Real-time dinleme hatası:", error);
    });
}

/**
 * Öğrencinin randevularını real-time dinle
 */
export function listenToStudentAppointments(
    studentId: string,
    callback: (appointments: Appointment[]) => void
): Unsubscribe {
    const q = query(
        collection(db, "appointments"),
        where("studentId", "==", studentId),
        orderBy("datetime", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const appointments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Appointment));
        callback(appointments);
    }, (error) => {
        console.error("Real-time dinleme hatası:", error);
    });
}

/**
 * Randevuyu kullanıcı için gizle (soft delete)
 */
export async function hideAppointment(
    appointmentId: string,
    userId: string
): Promise<void> {
    try {
        const appointmentRef = doc(db, "appointments", appointmentId);
        const appointmentSnap = await getDocs(query(
            collection(db, "appointments"),
            where("__name__", "==", appointmentId)
        ));

        if (appointmentSnap.empty) {
            throw new Error("Randevu bulunamadı");
        }

        const appointment = appointmentSnap.docs[0].data() as Appointment;
        const currentHiddenFrom = appointment.hiddenFrom || [];

        // Kullanıcı zaten gizlediyse hata verme
        if (currentHiddenFrom.includes(userId)) {
            return;
        }

        await updateDoc(appointmentRef, {
            hiddenFrom: [...currentHiddenFrom, userId],
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Randevu gizleme hatası:", error);
        throw error;
    }
}
