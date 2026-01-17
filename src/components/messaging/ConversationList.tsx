"use client";

import { useEffect, useState } from "react";
import { listenToConversations } from "@/lib/firebase/messaging";
import type { Conversation } from "@/lib/firebase/messaging";
import { format, isToday, isYesterday } from "date-fns";
import { tr } from "date-fns/locale";

interface ConversationListProps {
    userId: string;
    userRole: "student" | "coach" | "admin";
    onSelectConversation: (convId: string, otherUser: any) => void;
    selectedConvId?: string;
}

export default function ConversationList({
    userId,
    userRole,
    onSelectConversation,
    selectedConvId,
}: ConversationListProps) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = listenToConversations(userId, (convs) => {
            setConversations(convs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const formatLastMessageTime = (timestamp: any) => {
        if (!timestamp) return "";

        const date = timestamp.toDate();

        if (isToday(date)) {
            return format(date, "HH:mm", { locale: tr });
        } else if (isYesterday(date)) {
            return "Dün";
        } else {
            return format(date, "dd/MM/yy", { locale: tr });
        }
    };

    const getOtherUser = (conv: Conversation) => {
        const isStudent = userId === conv.participants.studentId;

        if (isStudent) {
            return {
                id: conv.participants.coachId,
                name: conv.participants.coachName,
                photo: conv.participants.coachPhoto,
                role: "coach" as const,
            };
        } else {
            return {
                id: conv.participants.studentId,
                name: conv.participants.studentName,
                photo: conv.participants.studentPhoto,
                role: "student" as const,
            };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400 p-4">
                <div className="text-center">
                    <p className="text-2xl mb-2">💬</p>
                    <p>Henüz mesajınız yok</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto h-full">
            {conversations.map((conv) => {
                const otherUser = getOtherUser(conv);
                const unreadCount = conv.unreadCount[userId] || 0;
                const isSelected = conv.id === selectedConvId;

                return (
                    <button
                        key={conv.id}
                        onClick={() => onSelectConversation(conv.id, otherUser)}
                        className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left ${isSelected ? "bg-indigo-50" : ""
                            }`}
                    >
                        <div className="flex gap-3">
                            {/* Avatar */}
                            {otherUser.photo ? (
                                <img
                                    src={otherUser.photo}
                                    alt={otherUser.name}
                                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                                    {otherUser.name.charAt(0).toUpperCase()}
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                    <h4 className={`font-semibold truncate ${unreadCount > 0 ? "text-gray-900" : "text-gray-700"}`}>
                                        {otherUser.name}
                                    </h4>
                                    {conv.lastMessage && (
                                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                            {formatLastMessageTime(conv.lastMessage.timestamp)}
                                        </span>
                                    )}
                                </div>

                                {/* Last Message Preview */}
                                {conv.lastMessage && (
                                    <div className="flex items-center justify-between">
                                        <p className={`text-sm truncate ${unreadCount > 0 ? "font-medium text-gray-900" : "text-gray-500"}`}>
                                            {conv.lastMessage.senderId === userId && "Sen: "}
                                            {conv.lastMessage.text}
                                        </p>

                                        {/* Unread Badge */}
                                        {unreadCount > 0 && (
                                            <span className="ml-2 bg-indigo-600 text-white text-xs font-bold rounded-full px-2 py-0.5 flex-shrink-0">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
