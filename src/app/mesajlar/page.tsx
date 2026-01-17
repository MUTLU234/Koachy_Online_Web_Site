"use client";

/**
 * Mesajlar Sayfası
 * 
 * Koç ve öğrenciler arasında 1-1 mesajlaşma
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ConversationList from "@/components/messaging/ConversationList";
import ChatWindow from "@/components/messaging/ChatWindow";
import { getOrCreateConversation } from "@/lib/firebase/messaging";
import { getCoachById } from "@/lib/firebase/coaches";

function MessagingContent() {
    const { user, userData } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
    const [selectedOtherUser, setSelectedOtherUser] = useState<any>(null);
    const [showChat, setShowChat] = useState(false); // For mobile toggle
    const [loading, setLoading] = useState(false);

    // Auto-create conversation from coachId query param
    useEffect(() => {
        const coachId = searchParams.get('coachId');
        if (coachId && user && userData) {
            setLoading(true);
            createConversationWithCoach(coachId);
        }
    }, [searchParams, user, userData]);

    const createConversationWithCoach = async (coachId: string) => {
        if (!user || !userData) return;

        try {
            // Get coach info
            const coach = await getCoachById(coachId);
            if (!coach) {
                alert("Koç bulunamadı");
                return;
            }

            // Create or get conversation
            const convId = await getOrCreateConversation(
                {
                    id: user.uid,
                    name: userData.displayName,
                    photo: userData.profilePicUrl,
                    role: "student"
                },
                {
                    id: coach.userId,
                    name: coach.user.displayName,
                    photo: coach.user.profilePicUrl,
                    role: "coach"
                }
            );

            // Select the conversation
            setSelectedConvId(convId);
            setSelectedOtherUser({
                id: coach.userId,
                name: coach.user.displayName,
                photo: coach.user.profilePicUrl,
                role: "coach"
            });
            setShowChat(true);

            // Remove query param
            router.replace('/mesajlar');
        } catch (error) {
            console.error("Konuşma oluşturma hatası:", error);
            alert("Konuşma başlatılamadı. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectConversation = (convId: string, otherUser: any) => {
        setSelectedConvId(convId);
        setSelectedOtherUser(otherUser);
        setShowChat(true); // Show chat on mobile
    };

    const handleBackToList = () => {
        setShowChat(false);
        setSelectedConvId(null);
        setSelectedOtherUser(null);
    };

    if (!user || !userData) {
        return <div className="p-8 text-center">Yükleniyor...</div>;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Konuşma başlatılıyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container-custom py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Mobile back button */}
                        {showChat && (
                            <button
                                onClick={handleBackToList}
                                className="md:hidden btn-secondary py-2 px-3"
                            >
                                ←
                            </button>
                        )}
                        <h1 className="text-2xl font-display font-bold text-indigo-600">
                            💬 Mesajlar
                        </h1>
                    </div>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="btn-secondary text-sm py-2 px-4"
                    >
                        ← Dashboard
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="container-custom py-4">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: "calc(100vh - 180px)" }}>
                    <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                        {/* Conversations Sidebar */}
                        <div className={`border-r border-gray-200 ${showChat ? "hidden md:block" : "block"}`}>
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="font-semibold text-gray-900">Konuşmalar</h2>
                            </div>
                            <ConversationList
                                userId={user.uid}
                                userRole={userData.role}
                                onSelectConversation={handleSelectConversation}
                                selectedConvId={selectedConvId || undefined}
                            />
                        </div>

                        {/* Chat Window */}
                        <div className={`md:col-span-2 ${showChat ? "block" : "hidden md:block"}`}>
                            {selectedConvId && selectedOtherUser ? (
                                <ChatWindow
                                    conversationId={selectedConvId}
                                    otherUser={selectedOtherUser}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400">
                                    <div className="text-center">
                                        <p className="text-4xl mb-4">💬</p>
                                        <p className="text-lg font-medium text-gray-600">Bir konuşma seçin</p>
                                        <p className="text-sm">Mesajlaşmaya başlamak için soldaki listeden bir kişi seçin</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MessagingPage() {
    return (
        <ProtectedRoute>
            <MessagingContent />
        </ProtectedRoute>
    );
}
