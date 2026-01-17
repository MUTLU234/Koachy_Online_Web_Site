import { db } from "./config";
import { collection, query, where, getDocs, orderBy, limit, startAfter, DocumentData, Query, doc, getDoc } from "firebase/firestore";
import type { Coach, User } from "@/types";

export interface CoachWithUser extends Coach {
    user: User;
}

export interface CoachFilterOptions {
    specialties?: string[];
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    minExperience?: number;
    examType?: string;
}

/**
 * Koçları filtreleyerek getir
 * Not: Firestore'da karmaşık filtrelemeler için composite index gerekebilir.
 * Şimdilik basit filtreleme yapıp client-side'da detaylandıracağız veya
 * Firestore query'lerini optimize edeceğiz.
 */
export async function getCoaches(filters: CoachFilterOptions = {}): Promise<CoachWithUser[]> {
    try {
        let q: Query<DocumentData> = collection(db, "coaches");

        // Sadece onaylı koçları getir
        q = query(q, where("verified", "==", true));

        // Firestore kısıtlamaları nedeniyle, çoklu filtrelemeyi client tarafında yapmak
        // bazen daha esnek olabilir. Ancak performans için mümkün olduğunca server-side filtreleme yapacağız.

        // Not: "array-contains-any" ile "range" filtreleri aynı anda kullanıldığında index hatası verebilir.
        // Bu yüzden şimdilik temel sorguyu çekip memory'de filtreleyeceğiz.

        const snapshot = await getDocs(q);
        const coaches: CoachWithUser[] = [];

        for (const doc of snapshot.docs) {
            const coachData = doc.data() as Coach;

            // Filtreleme Mantığı (Client-Side Filtering for flexibility)

            // 1. Uzmanlık Alanı Filtresi
            if (filters.specialties && filters.specialties.length > 0) {
                const hasSpecialty = coachData.specialties.some(s => filters.specialties?.includes(s));
                if (!hasSpecialty) continue;
            }

            // 2. Fiyat Filtresi
            if (filters.minPrice !== undefined && coachData.hourlyRate < filters.minPrice) continue;
            if (filters.maxPrice !== undefined && coachData.hourlyRate > filters.maxPrice) continue;

            // 3. Puan Filtresi
            if (filters.minRating !== undefined && coachData.rating < filters.minRating) continue;

            // 4. Deneyim Filtresi
            if (filters.minExperience !== undefined && coachData.experience < filters.minExperience) continue;

            // Kullanıcı detaylarını çek (Ad, Soyad, Fotoğraf için)
            // Not: Gerçek uygulamada bunu "users" koleksiyonundan join ile veya
            // koç dokümanında denormalize ederek tutmak daha performanslıdır.
            // Şimdilik ayrı sorgu atıyoruz.
            const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", coachData.userId)));

            if (!userDoc.empty) {
                const userData = userDoc.docs[0].data() as User;
                coaches.push({
                    ...coachData,
                    id: doc.id, // FIRESTORE DOCUMENT ID - koç profil linkinde kullanılıyor (spread'deki id'yi override eder)
                    user: userData
                });
            }
        }

        return coaches;
    } catch (error) {
        console.error("Koçları getirme hatası:", error);
        return [];
    }
}

/**
 * ID'ye göre koç detayını getir
 */
export async function getCoachById(coachId: string): Promise<CoachWithUser | null> {
    try {
        const coachRef = doc(db, "coaches", coachId);
        const coachSnap = await getDoc(coachRef);

        if (!coachSnap.exists()) return null;

        const coachData = coachSnap.data() as Coach;

        // Get User Data
        // Note: coachData.userId is the link to users collection
        const userRef = doc(db, "users", coachData.userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // Fallback if user not found (should not happen)
            console.warn(`User data not found for coach ${coachId}`);
            return null;
        }

        return {
            ...coachData,
            user: userSnap.data() as User
        };
    } catch (error) {
        console.error("Koç detayı getirme hatası:", error);
        return null;
    }
}
