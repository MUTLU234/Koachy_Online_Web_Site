import { db } from "./config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import type { User, Coach } from "@/types";

const DUMMY_COACHES = [
    {
        uid: "coach1",
        displayName: "Dr. Ayşe Yılmaz",
        email: "ayse@koachy.com",
        specialties: ["Matematik", "Geometri", "YKS Koçluğu"],
        hourlyRate: 500,
        rating: 4.9,
        experience: 12,
        education: "ODTÜ Matematik Öğretmenliği",
        bio: "12 yıllık deneyimimle öğrencileri YKS'ye hazırlıyorum. Matematik korkunuzu yenmenize yardımcı olabilirim.",
        profilePicUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayse"
    },
    {
        uid: "coach2",
        displayName: "Mehmet Demir",
        email: "mehmet@koachy.com",
        specialties: ["Fizik", "Fen Bilimleri", "LGS Koçluğu"],
        hourlyRate: 400,
        rating: 4.7,
        experience: 8,
        education: "Boğaziçi Fizik",
        bio: "Fiziği günlük hayatla ilişkilendirerek anlatıyorum. LGS ve YKS süreçlerinde yanınızdayım.",
        profilePicUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mehmet"
    },
    {
        uid: "coach3",
        displayName: "Zeynep Kaya",
        email: "zeynep@koachy.com",
        specialties: ["İngilizce", "Yabancı Dil", "Motivasyon"],
        hourlyRate: 350,
        rating: 4.8,
        experience: 5,
        education: "Hacettepe İngiliz Dili ve Edebiyatı",
        bio: "İngilizce öğrenmek hiç bu kadar keyifli olmamıştı. Sınavlara hazırlık ve konuşma pratiği yapıyoruz.",
        profilePicUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zeynep"
    },
    {
        uid: "coach4",
        displayName: "Can Yıldız",
        email: "can@koachy.com",
        specialties: ["Kimya", "Biyoloji", "Planlama"],
        hourlyRate: 450,
        rating: 4.6,
        experience: 7,
        education: "İTÜ Kimya Mühendisliği",
        bio: "Sayısal derslerdeki başarınızı artırmak için stratejik çalışma planları hazırlıyorum.",
        profilePicUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Can"
    },
    {
        uid: "coach5",
        displayName: "Elif Şahin",
        email: "elif@koachy.com",
        specialties: ["Türkçe", "Edebiyat", "Hızlı Okuma"],
        hourlyRate: 300,
        rating: 4.9,
        experience: 15,
        education: "Marmara Türkçe Öğretmenliği",
        bio: "Paragraf sorularını hızlı ve doğru çözmek için teknikler öğretiyorum.",
        profilePicUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elif"
    }
];

export async function seedCoaches() {
    try {
        for (const coach of DUMMY_COACHES) {
            // 1. User oluştur
            const userRef = doc(db, "users", coach.uid);
            const userData: User = {
                uid: coach.uid,
                email: coach.email,
                displayName: coach.displayName,
                role: "coach",
                profilePicUrl: coach.profilePicUrl,
                isActive: true,
                emailVerified: true,
                createdAt: serverTimestamp() as any,
                updatedAt: serverTimestamp() as any
            };
            await setDoc(userRef, userData);

            // 2. Coach profili oluştur
            const coachRef = doc(db, "coaches", coach.uid);
            const coachData: Coach = {
                id: coach.uid,
                userId: coach.uid,
                specialties: coach.specialties,
                experience: coach.experience,
                education: coach.education,
                rating: coach.rating,
                totalReviews: Math.floor(Math.random() * 50) + 10,
                hourlyRate: coach.hourlyRate,
                schedule: {},
                verified: true,
                bio: coach.bio,
                createdAt: serverTimestamp() as any,
                updatedAt: serverTimestamp() as any
            };
            await setDoc(coachRef, coachData);
        }
        console.log("✅ Örnek koç verileri başarıyla eklendi!");
        return true;
    } catch (error) {
        console.error("Seed hatası:", error);
        return false;
    }
}
