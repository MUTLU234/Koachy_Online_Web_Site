import { db } from "./config";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import type { CoachSchedule } from "@/types";

/**
 * Koçun takvimini getir
 */
export async function getCoachSchedule(coachId: string): Promise<CoachSchedule | null> {
    try {
        const coachRef = doc(db, "coaches", coachId);
        const coachSnap = await getDoc(coachRef);

        if (coachSnap.exists()) {
            return coachSnap.data().schedule || null;
        }
        return null;
    } catch (error) {
        console.error("Takvim getirme hatası:", error);
        throw error;
    }
}

/**
 * Koçun takvimini güncelle
 */
export async function updateCoachSchedule(coachId: string, schedule: CoachSchedule): Promise<void> {
    try {
        const coachRef = doc(db, "coaches", coachId);
        await updateDoc(coachRef, {
            schedule,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Takvim güncelleme hatası:", error);
        throw error;
    }
}
