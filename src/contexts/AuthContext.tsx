"use client";

/**
 * Authentication Context
 * 
 * Firebase Auth durumunu yöneten React Context
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
} from "firebase/auth";
import { auth, logFirebaseConfig } from "@/lib/firebase/config";
import {
    createOrUpdateUserDoc,
    getUserDoc,
    createCoachProfile,
    createStudentProfile,
    updateEmailVerificationStatus,
} from "@/lib/firebase/helpers";
import type { User, UserRole } from "@/types";

interface AuthContextType {
    user: FirebaseUser | null;
    userData: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (
        email: string,
        password: string,
        displayName: string,
        role: UserRole
    ) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    sendVerificationEmail: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Kullanıcı verilerini yenile
    const refreshUserData = async (currentUser: FirebaseUser | null = null) => {
        const targetUser = currentUser || user;
        if (targetUser) {
            const data = await getUserDoc(targetUser.uid);
            setUserData(data);

            // Email doğrulama durumunu senkronize et
            if (targetUser.emailVerified && data && !data.emailVerified) {
                await updateEmailVerificationStatus(targetUser.uid, true);
            }
        }
    };

    // Auth state değişikliklerini dinle
    useEffect(() => {
        // Development modunda config'i logla
        logFirebaseConfig();

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Token al ve cookie'ye yaz (Middleware için)
                const token = await firebaseUser.getIdToken();
                document.cookie = `session=${token}; path=/; secure; samesite=strict`;
                
                await refreshUserData(firebaseUser);
            } else {
                // Cookie'yi temizle
                document.cookie = `session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
                setUserData(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Email/Password ile giriş
    const signIn = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: unknown) {
            console.error("Giriş hatası:", error);
            const errorCode = (error as { code?: string }).code || "unknown";
            throw new Error(getFirebaseErrorMessage(errorCode));
        }
    };

    // Email/Password ile kayıt
    const signUp = async (
        email: string,
        password: string,
        displayName: string,
        role: UserRole
    ) => {
        try {
            // Firebase Auth'ta kullanıcı oluştur
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const { user: firebaseUser } = userCredential;

            // Profil bilgilerini güncelle
            await updateProfile(firebaseUser, { displayName });

            // Firestore'da kullanıcı dokümanı oluştur
            await createOrUpdateUserDoc(firebaseUser.uid, {
                uid: firebaseUser.uid,
                email,
                displayName,
                role,
                emailVerified: false,
            });

            // Rol bazlı profil oluştur
            if (role === "coach") {
                await createCoachProfile(firebaseUser.uid, {
                    specialties: [],
                    experience: 0,
                    education: "",
                    schedule: {},
                    bio: "",
                });
            } else if (role === "student") {
                await createStudentProfile(firebaseUser.uid, {});
            }

            // Email doğrulama gönder
            await sendEmailVerification(firebaseUser);
        } catch (error: unknown) {
            console.error("Kayıt hatası:", error);
            const errorCode = (error as { code?: string }).code || "unknown";
            throw new Error(getFirebaseErrorMessage(errorCode));
        }
    };

    // Google ile giriş
    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: "select_account" });

            const result = await signInWithPopup(auth, provider);
            const { user: firebaseUser } = result;

            // Kullanıcı ilk kez mi giriş yapıyor kontrol et
            const existingUser = await getUserDoc(firebaseUser.uid);

            if (!existingUser) {
                // Yeni kullanıcı - varsayılan student rolü ile kaydet
                await createOrUpdateUserDoc(firebaseUser.uid, {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || "",
                    displayName: firebaseUser.displayName || "",
                    role: "student",
                    emailVerified: firebaseUser.emailVerified,
                    profilePicUrl: firebaseUser.photoURL || undefined,
                });

                await createStudentProfile(firebaseUser.uid, {});
            }
        } catch (error: unknown) {
            console.error("Google giriş hatası:", error);
            const errorCode = (error as { code?: string }).code || "unknown";
            throw new Error(getFirebaseErrorMessage(errorCode));
        }
    };

    // Çıkış
    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUserData(null);
        } catch (error: unknown) {
            console.error("Çıkış hatası:", error);
            throw new Error("Çıkış yapılırken bir hata oluştu");
        }
    };

    // Email doğrulama gönder
    const sendVerificationEmail = async () => {
        if (!user) throw new Error("Kullanıcı bulunamadı");

        try {
            await sendEmailVerification(user);
        } catch (error: unknown) {
            console.error("Email doğrulama gönderme hatası:", error);
            throw new Error("Email doğrulama gönderilemedi");
        }
    };

    // Parola sıfırlama
    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error: unknown) {
            console.error("Parola sıfırlama hatası:", error);
            const errorCode = (error as { code?: string }).code || "unknown";
            throw new Error(getFirebaseErrorMessage(errorCode));
        }
    };

    const value = {
        user,
        userData,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        sendVerificationEmail,
        resetPassword,
        refreshUserData,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// Firebase hata mesajlarını Türkçe'ye çevir
function getFirebaseErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
        "auth/email-already-in-use": "Bu email adresi zaten kullanımda",
        "auth/invalid-email": "Geçersiz email adresi",
        "auth/operation-not-allowed": "Bu işlem şu an aktif değil",
        "auth/weak-password": "Şifre çok zayıf",
        "auth/user-disabled": "Bu hesap devre dışı bırakıldı",
        "auth/user-not-found": "Kullanıcı bulunamadı",
        "auth/wrong-password": "Hatalı şifre",
        "auth/too-many-requests": "Çok fazla deneme. Lütfen daha sonra tekrar deneyin",
        "auth/network-request-failed": "Ağ bağlantısı hatası",
        "auth/popup-closed-by-user": "Giriş penceresi kapatıldı",
        "auth/cancelled-popup-request": "Giriş işlemi iptal edildi",
    };

    return errorMessages[errorCode] || "Bir hata oluştu. Lütfen tekrar deneyin";
}
