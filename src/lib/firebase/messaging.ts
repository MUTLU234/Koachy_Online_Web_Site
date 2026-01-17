import { db } from "./config";
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    Timestamp,
    increment,
    writeBatch,
} from "firebase/firestore";

/**
 * Mesajlaşma Helper Fonksiyonları
 * 
 * Koç ve öğrenciler arasında 1-1 real-time mesajlaşma
 */

export interface ConversationParticipant {
    id: string;
    name: string;
    photo?: string;
    role: "student" | "coach";
}

export interface Conversation {
    id: string;
    participants: {
        studentId: string;
        studentName: string;
        studentPhoto?: string;
        coachId: string;
        coachName: string;
        coachPhoto?: string;
    };
    lastMessage?: {
        text: string;
        senderId: string;
        timestamp: Timestamp;
        read: boolean;
    };
    unreadCount: {
        [userId: string]: number;
    };
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: Timestamp;
    read: boolean;
    readAt?: Timestamp | null;
}

/**
 * Konuşma ID'si oluştur (deterministik)
 */
function generateConversationId(studentId: string, coachId: string): string {
    // Her zaman aynı sırada olması için alfabetik sıralama
    return `conv_${[studentId, coachId].sort().join("_")}`;
}

/**
 * Konuşma oluştur veya mevcut olanı getir
 */
export async function getOrCreateConversation(
    student: ConversationParticipant,
    coach: ConversationParticipant
): Promise<string> {
    const convId = generateConversationId(student.id, coach.id);
    const convRef = doc(db, "conversations", convId);
    const convSnap = await getDoc(convRef);

    if (!convSnap.exists()) {
        // Yeni konuşma oluştur
        await setDoc(convRef, {
            participants: {
                studentId: student.id,
                studentName: student.name,
                studentPhoto: student.photo || null,
                coachId: coach.id,
                coachName: coach.name,
                coachPhoto: coach.photo || null,
            },
            unreadCount: {
                [student.id]: 0,
                [coach.id]: 0,
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    }

    return convId;
}

/**
 * Mesaj gönder
 */
export async function sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    text: string
): Promise<void> {
    if (!text.trim()) {
        throw new Error("Mesaj boş olamaz");
    }

    const convRef = doc(db, "conversations", conversationId);
    const messagesRef = collection(db, `conversations/${conversationId}/messages`);

    // Alıcı ID'sini bul
    const convSnap = await getDoc(convRef);
    if (!convSnap.exists()) {
        throw new Error("Konuşma bulunamadı");
    }

    const convData = convSnap.data();
    const receiverId =
        senderId === convData.participants.studentId
            ? convData.participants.coachId
            : convData.participants.studentId;

    // Mesaj ekle
    await addDoc(messagesRef, {
        senderId,
        senderName,
        text: text.trim(),
        timestamp: serverTimestamp(),
        read: false,
        readAt: null,
    });

    // Konuşmayı güncelle
    await updateDoc(convRef, {
        lastMessage: {
            text: text.trim(),
            senderId,
            timestamp: serverTimestamp(),
            read: false,
        },
        [`unreadCount.${receiverId}`]: increment(1),
        updatedAt: serverTimestamp(),
    });
}

/**
 * Kullanıcının tüm konuşmalarını getir
 */
export async function getConversations(userId: string): Promise<Conversation[]> {
    const conversationsRef = collection(db, "conversations");
    const q1 = query(
        conversationsRef,
        where("participants.studentId", "==", userId),
        orderBy("updatedAt", "desc")
    );
    const q2 = query(
        conversationsRef,
        where("participants.coachId", "==", userId),
        orderBy("updatedAt", "desc")
    );

    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

    const conversations: Conversation[] = [];

    snap1.forEach((doc) => {
        conversations.push({ id: doc.id, ...doc.data() } as Conversation);
    });

    snap2.forEach((doc) => {
        conversations.push({ id: doc.id, ...doc.data() } as Conversation);
    });

    // Tarih sırasına göre sırala (en yeni önce)
    conversations.sort((a, b) => {
        const aTime = a.updatedAt?.toMillis() || 0;
        const bTime = b.updatedAt?.toMillis() || 0;
        return bTime - aTime;
    });

    return conversations;
}

/**
 * Konuşmadaki mesajları real-time dinle
 */
export function listenToMessages(
    conversationId: string,
    callback: (messages: Message[]) => void
): () => void {
    const messagesRef = collection(db, `conversations/${conversationId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages: Message[] = [];
        snapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() } as Message);
        });
        callback(messages);
    });

    return unsubscribe;
}

/**
 * Konuşmaları real-time dinle
 */
export function listenToConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void
): () => void {
    const conversationsRef = collection(db, "conversations");

    // İki query'yi birleştirmek için her ikisinealso dinleyelim
    const q1 = query(
        conversationsRef,
        where("participants.studentId", "==", userId),
        orderBy("updatedAt", "desc")
    );
    const q2 = query(
        conversationsRef,
        where("participants.coachId", "==", userId),
        orderBy("updatedAt", "desc")
    );

    const conversations = new Map<string, Conversation>();

    const unsubscribe1 = onSnapshot(q1, (snapshot) => {
        snapshot.forEach((doc) => {
            conversations.set(doc.id, { id: doc.id, ...doc.data() } as Conversation);
        });
        emitConversations();
    });

    const unsubscribe2 = onSnapshot(q2, (snapshot) => {
        snapshot.forEach((doc) => {
            conversations.set(doc.id, { id: doc.id, ...doc.data() } as Conversation);
        });
        emitConversations();
    });

    function emitConversations() {
        const convArray = Array.from(conversations.values()).sort((a, b) => {
            const aTime = a.updatedAt?.toMillis() || 0;
            const bTime = b.updatedAt?.toMillis() || 0;
            return bTime - aTime;
        });
        callback(convArray);
    }

    return () => {
        unsubscribe1();
        unsubscribe2();
    };
}

/**
 * Mesajları okundu işaretle
 */
export async function markMessagesAsRead(
    conversationId: string,
    userId: string
): Promise<void> {
    const convRef = doc(db, "conversations", conversationId);
    const messagesRef = collection(db, `conversations/${conversationId}/messages`);

    // Okunmamış mesajları bul (diğer kişiden gelenler)
    const q = query(messagesRef, where("read", "==", false), where("senderId", "!=", userId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return;

    // Batch update
    const batch = writeBatch(db);

    snapshot.forEach((doc) => {
        batch.update(doc.ref, {
            read: true,
            readAt: serverTimestamp(),
        });
    });

    // Okunmamış sayısını sıfırla
    batch.update(convRef, {
        [`unreadCount.${userId}`]: 0,
    });

    await batch.commit();
}

/**
 * Toplam okunmamış mesaj sayısı
 */
export async function getTotalUnreadCount(userId: string): Promise<number> {
    const conversations = await getConversations(userId);
    return conversations.reduce((total, conv) => {
        return total + (conv.unreadCount[userId] || 0);
    }, 0);
}
