/**
 * Firebase Konfigürasyonu
 * 
 * Bu dosya Firebase SDK'yı başlatır ve tüm Firebase servislerini export eder.
 * Environment variables'dan credentials okunur.
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getFunctions, Functions } from "firebase/functions";

// Firebase konfigürasyonu .env dosyasından okunur
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase'in birden fazla kez initialize edilmesini önle
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let functions: Functions;

if (!getApps().length) {
    // İlk kez initialize ediyorsak
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    functions = getFunctions(app);

    // Development modunda Türkçe console log
    if (process.env.NODE_ENV === "development") {
        console.log("✅ Firebase başarıyla initialize edildi");
    }
} else {
    // Zaten initialize edilmişse mevcut instance'ı kullan
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    functions = getFunctions(app);
}

// Türkçe dil ayarı (Auth hata mesajları için)
auth.languageCode = "tr";

/**
 * Firebase servisleri export ediliyor
 */
export { app, auth, db, storage, functions };

/**
 * Firebase konfigürasyonunun geçerli olup olmadığını kontrol et
 */
export const isFirebaseConfigured = (): boolean => {
    return !!(
        firebaseConfig.apiKey &&
        firebaseConfig.authDomain &&
        firebaseConfig.projectId &&
        firebaseConfig.storageBucket &&
        firebaseConfig.messagingSenderId &&
        firebaseConfig.appId
    );
};

/**
 * Firebase konfigürasyon bilgilerini log'la (güvenli)
 * Sadece development modunda çalışır
 */
export const logFirebaseConfig = (): void => {
    if (process.env.NODE_ENV === "development") {
        console.log("📱 Firebase Konfigürasyonu:");
        console.log("  Project ID:", firebaseConfig.projectId || "❌ Tanımlanmamış");
        console.log("  Auth Domain:", firebaseConfig.authDomain || "❌ Tanımlanmamış");
        console.log(
            "  API Key:",
            firebaseConfig.apiKey ? "✅ Tanımlı" : "❌ Tanımlanmamış"
        );
        console.log(
            "  Storage Bucket:",
            firebaseConfig.storageBucket || "❌ Tanımlanmamış"
        );
    }
};
