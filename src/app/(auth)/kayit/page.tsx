"use client";

/**
 * Kayıt (Register) Sayfası
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";

export default function RegisterPage() {
    const router = useRouter();
    const { signUp, signInWithGoogle } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setError("");
        setLoading(true);

        try {
            await signUp(data.email, data.password, data.displayName, data.role);
            setSuccess(true);

            // 2 saniye sonra dashboard'a yönlendir
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Kayıt olurken bir hata oluştu";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        setLoading(true);

        try {
            await signInWithGoogle();
            router.push("/dashboard");
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Google ile kayıt olurken bir hata oluştu";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="card p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-accent"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Kayıt Başarılı!
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Email adresinize doğrulama linki gönderildi. Lütfen email'inizi kontrol edin.
                    </p>
                    <p className="text-sm text-gray-500">
                        Dashboard'a yönlendiriliyorsunuz...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo ve Başlık */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-display font-bold text-indigo-600 mb-2">
                        Koachy
                    </h1>
                    <p className="text-gray-600">Yeni hesap oluşturun</p>
                </div>

                {/* Hata Mesajı */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <div className="card p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Ad Soyad */}
                        <div>
                            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                                Ad Soyad
                            </label>
                            <input
                                {...register("displayName")}
                                type="text"
                                id="displayName"
                                className="input w-full"
                                placeholder="Ahmet Yılmaz"
                                disabled={loading}
                            />
                            {errors.displayName && (
                                <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Adresi
                            </label>
                            <input
                                {...register("email")}
                                type="email"
                                id="email"
                                className="input w-full"
                                placeholder="ornek@email.com"
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Telefon (Opsiyonel) */}
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                Telefon (Opsiyonel)
                            </label>
                            <input
                                {...register("phoneNumber")}
                                type="tel"
                                id="phoneNumber"
                                className="input w-full"
                                placeholder="5551234567"
                                disabled={loading}
                            />
                            {errors.phoneNumber && (
                                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                            )}
                        </div>

                        {/* Rol Seçimi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hesap Türü
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-indigo-600 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50">
                                    <input
                                        {...register("role")}
                                        type="radio"
                                        value="student"
                                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                                        disabled={loading}
                                    />
                                    <span className="ml-3 text-sm font-medium text-gray-900">
                                        Öğrenci
                                    </span>
                                </label>
                                <label className="relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-indigo-600 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50">
                                    <input
                                        {...register("role")}
                                        type="radio"
                                        value="coach"
                                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                                        disabled={loading}
                                    />
                                    <span className="ml-3 text-sm font-medium text-gray-900">
                                        Koç
                                    </span>
                                </label>
                            </div>
                            {errors.role && (
                                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                            )}
                        </div>

                        {/* Şifre */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Şifre
                            </label>
                            <input
                                {...register("password")}
                                type="password"
                                id="password"
                                className="input w-full"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                En az 8 karakter, büyük/küçük harf, rakam ve özel karakter
                            </p>
                        </div>

                        {/* Şifre Tekrar */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Şifre Tekrar
                            </label>
                            <input
                                {...register("confirmPassword")}
                                type="password"
                                id="confirmPassword"
                                className="input w-full"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Kullanım Koşulları */}
                        <div>
                            <label className="flex items-start">
                                <input
                                    {...register("acceptTerms")}
                                    type="checkbox"
                                    className="w-4 h-4 mt-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
                                    disabled={loading}
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    <Link href="/kullanim-kosullari" className="text-indigo-600 hover:underline">
                                        Kullanım Koşullarını
                                    </Link>{" "}
                                    ve{" "}
                                    <Link href="/gizlilik-politikasi" className="text-indigo-600 hover:underline">
                                        Gizlilik Politikasını
                                    </Link>{" "}
                                    okudum ve kabul ediyorum
                                </span>
                            </label>
                            {errors.acceptTerms && (
                                <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
                            )}
                        </div>

                        {/* Kayıt Ol Butonu */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
                        </button>
                    </form>

                    {/* Ayırıcı */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">veya</span>
                        </div>
                    </div>

                    {/* Google ile Kayıt */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Google ile Kayıt Ol
                    </button>

                    {/* Giriş Yap Linki */}
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Zaten hesabınız var mı?{" "}
                        <Link
                            href="/giris"
                            className="text-indigo-600 hover:text-indigo-600/80 font-medium transition-colors"
                        >
                            Giriş Yapın
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
