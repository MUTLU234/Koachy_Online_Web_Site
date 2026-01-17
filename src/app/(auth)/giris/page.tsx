"use client";

/**
 * Giriş (Login) Sayfası
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";

export default function LoginPage() {
    const router = useRouter();
    const { signIn, signInWithGoogle } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setError("");
        setLoading(true);

        try {
            await signIn(data.email, data.password);
            router.push("/dashboard");
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Giriş yapılırken bir hata oluştu";
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
            const errorMessage = err instanceof Error ? err.message : "Google ile giriş yapılırken bir hata oluştu";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                {/* Logo ve Başlık */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-display font-bold text-indigo-600 mb-2">
                        Koachy
                    </h1>
                    <p className="text-gray-600">Hesabınıza giriş yapın</p>
                </div>

                {/* Hata Mesajı */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <div className="card p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                        </div>

                        {/* Beni Hatırla & Şifremi Unuttum */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    {...register("rememberMe")}
                                    type="checkbox"
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
                                    disabled={loading}
                                />
                                <span className="ml-2 text-sm text-gray-600">Beni hatırla</span>
                            </label>
                            <Link
                                href="/parola-sifirlama"
                                className="text-sm text-indigo-600 hover:text-indigo-600/80 transition-colors"
                            >
                                Şifremi unuttum
                            </Link>
                        </div>

                        {/* Giriş Butonu */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
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

                    {/* Google ile Giriş */}
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
                        Google ile Giriş Yap
                    </button>

                    {/* Kayıt Ol Linki */}
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Hesabınız yok mu?{" "}
                        <Link
                            href="/kayit"
                            className="text-indigo-600 hover:text-indigo-600/80 font-medium transition-colors"
                        >
                            Kayıt Olun
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
