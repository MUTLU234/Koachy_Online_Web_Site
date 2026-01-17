"use client";

/**
 * Parola Sıfırlama Sayfası
 */

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setError("");
        setLoading(true);

        try {
            await resetPassword(data.email);
            setSuccess(true);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Parola sıfırlama linki gönderilemedi";
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
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Email Gönderildi!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Parola sıfırlama linki email adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.
                    </p>
                    <Link href="/giris" className="btn-primary inline-block">
                        Giriş Sayfasına Dön
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                {/* Başlık */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Şifrenizi mi Unuttunuz?
                    </h1>
                    <p className="text-gray-600">
                        Email adresinizi girin, size parola sıfırlama linki gönderelim
                    </p>
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
                                autoFocus
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Gönder Butonu */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? "Gönderiliyor..." : "Sıfırlama Linki Gönder"}
                        </button>
                    </form>

                    {/* Geri Dön */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/giris"
                            className="text-sm text-indigo-600 hover:text-indigo-600/80 transition-colors"
                        >
                            ← Giriş sayfasına dön
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
