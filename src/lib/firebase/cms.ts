import { db } from "./config";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { SiteContent, defaultSiteContent } from "@/types/cms";

const CONTENT_DOC_ID = "main-page";

/**
 * Site içeriğini getir
 * Eğer yoksa varsayılan içeriği oluşturur ve döndürür
 */
export async function getSiteContent(): Promise<SiteContent> {
    try {
        const docRef = doc(db, "siteContent", CONTENT_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as SiteContent;
        } else {
            // İlk kez çalışıyorsa varsayılan içeriği kaydet
            await setDoc(docRef, {
                ...defaultSiteContent,
                updatedAt: serverTimestamp()
            });
            return defaultSiteContent;
        }
    } catch (error) {
        console.error("Site içeriği getirme hatası:", error);
        return defaultSiteContent;
    }
}

/**
 * Site içeriğini güncelle
 */
export async function updateSiteContent(content: Partial<SiteContent>, userId: string): Promise<void> {
    try {
        const docRef = doc(db, "siteContent", CONTENT_DOC_ID);
        await updateDoc(docRef, {
            ...content,
            updatedAt: serverTimestamp(),
            updatedBy: userId
        });
    } catch (error) {
        console.error("Site içeriği güncelleme hatası:", error);
        throw error;
    }
}
