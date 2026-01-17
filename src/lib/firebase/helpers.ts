/**
 * Firebase Helper Functions
 * 
 * Firebase Auth ve Firestore işlemleri için yardımcı fonksiyonlar
 */

import { db } from "./config";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import type { User, Coach, Student } from "@/types";

/**
 * Kullanıcı dokümanı oluştur veya güncelle
 */
export async function createOrUpdateUserDoc(
    uid: string,
    data: Partial<User>
): Promise<void> {
    const userRef = doc(db, "users", uid);

    try {
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // Yeni kullanıcı - oluştur
            await setDoc(userRef, {
                uid,
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                isActive: true,
                emailVerified: false,
            });
        } else {
            // Mevcut kullanıcı - güncelle
            await updateDoc(userRef, {
                ...data,
                updatedAt: serverTimestamp(),
            });
        }
    } catch (error) {
        console.error("Kullanıcı dokümanı oluşturma/güncelleme hatası:", error);
        throw error;
    }
}

/**
 * Kullanıcı bilgilerini getir
 */
export async function getUserDoc(uid: string): Promise<User | null> {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data() as User;
        }

        return null;
    } catch (error) {
        console.error("Kullanıcı bilgileri getirme hatası:", error);
        throw error;
    }
}

/**
 * Koç profili oluştur
 */
export async function createCoachProfile(
    userId: string,
    coachData: Partial<Coach>
): Promise<void> {
    try {
        const coachRef = doc(db, "coaches", userId);

        await setDoc(coachRef, {
            id: userId,
            userId,
            ...coachData,
            rating: 0,
            totalReviews: 0,
            verified: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Koç profili oluşturma hatası:", error);
        throw error;
    }
}

/**
 * Öğrenci profili oluştur
 */
export async function createStudentProfile(
    userId: string,
    studentData: Partial<Student>
): Promise<void> {
    try {
        const studentRef = doc(db, "students", userId);

        await setDoc(studentRef, {
            id: userId,
            userId,
            ...studentData,
            enrolledCoaches: [],
            notes: [],
            progressReports: [],
            subscriptionStatus: "inactive",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Öğrenci profili oluşturma hatası:", error);
        throw error;
    }
}

/**
 * Kullanıcının rolünü kontrol et
 */
export async function checkUserRole(uid: string): Promise<string | null> {
    try {
        const user = await getUserDoc(uid);
        return user?.role || null;
    } catch (error) {
        console.error("Rol kontrol hatası:", error);
        return null;
    }
}

/**
 * Email doğrulama durumunu güncelle
 */
export async function updateEmailVerificationStatus(
    uid: string,
    verified: boolean
): Promise<void> {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
            emailVerified: verified,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Email doğrulama durumu güncelleme hatası:", error);
        throw error;
    }
}
