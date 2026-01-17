import { db } from "./config";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import type { Coach, Student, User } from "@/types";

/**
 * Kullanıcı profilini güncelle (User koleksiyonu)
 */
export async function updateUserProfile(uid: string, data: Partial<User>): Promise<void> {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Kullanıcı profili güncelleme hatası:", error);
        throw error;
    }
}

/**
 * Koç detaylarını güncelle (Coaches koleksiyonu)
 */
export async function updateCoachProfile(uid: string, data: Partial<Coach>): Promise<void> {
    try {
        const coachRef = doc(db, "coaches", uid);
        await updateDoc(coachRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Koç profili güncelleme hatası:", error);
        throw error;
    }
}

/**
 * Öğrenci detaylarını güncelle (Students koleksiyonu)
 */
export async function updateStudentProfile(uid: string, data: Partial<Student>): Promise<void> {
    try {
        const studentRef = doc(db, "students", uid);
        await updateDoc(studentRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Öğrenci profili güncelleme hatası:", error);
        throw error;
    }
}
