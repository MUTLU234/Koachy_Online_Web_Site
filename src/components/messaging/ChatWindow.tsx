"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { listenToMessages, sendMessage, markMessagesAsRead } from "@/lib/firebase/messaging";
import MessageBubble from "./MessageBubble";
import type { Message } from "@/lib/firebase/messaging";

interface ChatWindowProps {
    conversationId: string;
    otherUser: {
        id: string;
        name: string;
        photo?: string;
        role: "student" | "coach";
    };
}

export default function ChatWindow({ conversationId, otherUser }: ChatWindowProps) {
    const { user, userData } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Mesajları dinle (real-time)
    useEffect(() => {
        if (!conversationId) return;

        const unsubscribe = listenToMessages(conversationId, (newMessages) => {
            setMessages(newMessages);
            scrollToBottom();
        });

        return () => unsubscribe();
    }, [conversationId]);

    // Konuşma açıldığında mesajları okundu işaretle
    useEffect(() => {
        if (!conversationId || !user) return;

        const markAsRead = async () => {
            try {
                await markMessagesAsRead(conversationId, user.uid);
            } catch (error) {
                console.error("Okundu işaretleme hatası:", error);
            }
        };

        markAsRead();
    }, [conversationId, user]);

    // Mesaj gönder
    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!newMessage.trim() || !user || !userData || sending) return;

        setSending(true);
        try {
            await sendMessage(conversationId, user.uid, userData.displayName, newMessage);
            setNewMessage("");
            inputRef.current?.focus();
        } catch (error) {
            console.error("Mesaj gönderme hatası:", error);
            alert("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
        } finally {
            setSending(false);
        }
    };

    // Ctrl+Enter ile gönder
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && e.ctrlKey) {
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="border-b border-gray-200 p-4 bg-white">
                <div className="flex items-center gap-3">
                    {otherUser.photo ? (
                        <img
                            src={otherUser.photo}
                            alt={otherUser.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                            {otherUser.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
                        <p className="text-xs text-gray-500">
                            {otherUser.role === "coach" ? "Koç" : "Öğrenci"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                            <p className="text-lg mb-2">💬</p>
                            <p>Henüz mesaj yok</p>
                            <p className="text-sm">İlk mesajı gönderin</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <MessageBubble
                                key={message.id}
                                message={message}
                                isOwnMessage={message.senderId === user?.uid}
                                senderPhoto={message.senderId === user?.uid ? userData?.profilePicUrl : otherUser.photo}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white">
                <div className="flex gap-2">
                    <textarea
                        ref={inputRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Mesajınızı yazın... (Ctrl+Enter ile gönderin)"
                        className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
                        rows={2}
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="btn-primary self-end"
                    >
                        {sending ? "..." : "➤"}
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                    Ctrl+Enter ile hızlı gönder
                </p>
            </form>
        </div>
    );
}
