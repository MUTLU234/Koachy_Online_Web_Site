/**
 * Authentication Validation Schemas
 * 
 * Zod kullanarak form validasyonları için schema'lar
 * Tüm hata mesajları Türkçe
 */

import { z } from "zod";

/**
 * Email validation
 */
const emailSchema = z
    .string()
    .min(1, "Email adresi zorunludur")
    .email("Geçerli bir email adresi giriniz")
    .toLowerCase()
    .trim();

/**
 * Password validation
 * - Minimum 8 karakter
 * - En az 1 büyük harf
 * - En az 1 küçük harf
 * - En az 1 rakam
 * - En az 1 özel karakter
 */
const passwordSchema = z
    .string()
    .min(8, "Şifre en az 8 karakter olmalıdır")
    .regex(/[A-Z]/, "En az bir büyük harf içermelidir")
    .regex(/[a-z]/, "En az bir küçük harf içermelidir")
    .regex(/[0-9]/, "En az bir rakam içermelidir")
    .regex(/[^A-Za-z0-9]/, "En az bir özel karakter içermelidir (!@#$%^&* vb.)");

/**
 * Display name validation
 * - Sadece harf ve boşluk
 * - Türkçe karakterler destekleniyor
 */
const displayNameSchema = z
    .string()
    .min(2, "İsim en az 2 karakter olmalıdır")
    .max(50, "İsim en fazla 50 karakter olabilir")
    .regex(
        /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/,
        "Sadece harf ve boşluk kullanabilirsiniz"
    )
    .trim();

/**
 * Phone number validation (Türkiye formatı)
 * Format: 5XXXXXXXXX (10 haneli)
 */
const phoneNumberSchema = z
    .string()
    .regex(
        /^5[0-9]{9}$/,
        "Geçerli bir telefon numarası giriniz (örn: 5551234567)"
    )
    .optional();

/**
 * Kayıt (Register) Form Schema
 */
export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Şifre tekrarı zorunludur"),
    displayName: displayNameSchema,
    role: z.enum(["student", "coach"]).refine((val) => val === "student" || val === "coach", {
        message: "Geçersiz rol seçimi",
    }),
    phoneNumber: phoneNumberSchema,
    acceptTerms: z.boolean().refine((val) => val === true, {
        message: "Kullanım koşullarını kabul etmelisiniz",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
});

/**
 * Giriş (Login) Form Schema
 */
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Şifre zorunludur"),
    rememberMe: z.boolean().optional(),
});

/**
 * Parola Sıfırlama İsteği Schema
 */
export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

/**
 * Yeni Parola Belirleme Schema
 */
export const resetPasswordSchema = z.object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Şifre tekrarı zorunludur"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
});

/**
 * Email Güncelleme Schema
 */
export const updateEmailSchema = z.object({
    newEmail: emailSchema,
    password: z.string().min(1, "Mevcut şifrenizi giriniz"),
});

/**
 * Parola Değiştirme Schema
 */
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Mevcut şifre zorunludur"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, "Şifre tekrarı zorunludur"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Yeni şifreler eşleşmiyor",
    path: ["confirmNewPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: "Yeni şifre mevcut şifreden farklı olmalıdır",
    path: ["newPassword"],
});

/**
 * Profil Güncelleme Schema
 */
export const updateProfileSchema = z.object({
    displayName: displayNameSchema,
    phoneNumber: phoneNumberSchema,
    bio: z
        .string()
        .max(500, "Biyografi en fazla 500 karakter olabilir")
        .optional(),
});

/**
 * TypeScript type inference
 */
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateEmailFormData = z.infer<typeof updateEmailSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
