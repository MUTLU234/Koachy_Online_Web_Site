import { Timestamp } from "firebase/firestore";

/**
 * Kullanıcı rolleri
 */
export type UserRole = "student" | "coach" | "admin";

/**
 * Randevu durumları
 */
export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

/**
 * Ödeme durumları
 */
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

/**
 * Ödeme yöntemleri
 */
export type PaymentMethod = "stripe" | "iyzico";

/**
 * Abonelik durumları
 */
export type SubscriptionStatus = "active" | "inactive" | "trial";

/**
 * Kullanıcı tipi
 */
export interface User {
    uid: string;
    email: string;
    displayName: string;
    role: UserRole;
    profilePicUrl?: string;
    phoneNumber?: string;
    bio?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    isActive: boolean;
    emailVerified: boolean;
}

/**
 * Koç tipi
 */
export interface Coach {
    id: string;
    userId: string;
    specialties: string[];
    experience: number;
    education: string;
    rating: number;
    totalReviews: number;
    hourlyRate: number;
    schedule: CoachSchedule;
    verified: boolean;
    verifiedAt?: Timestamp;
    bio: string;
    achievements?: string[];
    demoVideoUrl?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/**
 * Koç takvimi
 */
export interface CoachSchedule {
    [dayOfWeek: string]: {
        available: boolean;
        slots: TimeSlot[];
    };
}

/**
 * Zaman aralığı
 */
export interface TimeSlot {
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

/**
 * Öğrenci tipi
 */
export interface Student {
    id: string;
    userId: string;
    enrolledCoaches: string[];
    grade?: string;
    targetExam?: string;
    notes: StudentNote[];
    progressReports: ProgressReport[];
    subscriptionStatus: SubscriptionStatus;
    subscriptionEndDate?: Timestamp;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/**
 * Öğrenci notu
 */
export interface StudentNote {
    id: string;
    title: string;
    fileUrl: string;
    uploadedBy: string;
    uploadedAt: Timestamp;
}

/**
 * Gelişim raporu
 */
export interface ProgressReport {
    id: string;
    coachId: string;
    content: string;
    createdAt: Timestamp;
}

/**
 * Randevu tipi
 */
export interface Appointment {
    id: string;
    studentId: string;
    coachId: string;
    datetime: Timestamp;
    duration: number;
    status: AppointmentStatus;
    meetingLink?: string;
    notes?: string;
    cancelledBy?: string;
    cancelReason?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/**
 * Mesaj tipi
 */
export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: Timestamp;
    read: boolean;
}

/**
 * Sohbet tipi
 */
export interface Chat {
    chatId: string;
    participants: {
        studentId: string;
        coachId: string;
    };
    messages: Message[];
    lastMessage: {
        text: string;
        timestamp: Timestamp;
        senderId: string;
    };
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/**
 * Ödeme tipi
 */
export interface Payment {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    paymentIntentId: string;
    description: string;
    metadata?: {
        packageType?: string;
        coachId?: string;
    };
    createdAt: Timestamp;
    completedAt?: Timestamp;
}

/**
 * Site içeriği (CMS)
 */
export interface SiteContent {
    section: string;
    content: {
        hero?: HeroContent;
        packages?: Package[];
        faq?: FAQItem[];
        testimonials?: Testimonial[];
    };
    updatedBy: string;
    updatedAt: Timestamp;
}

/**
 * Hero bölüm içeriği
 */
export interface HeroContent {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    backgroundImageUrl?: string;
}

/**
 * Paket tipi
 */
export interface Package {
    id: string;
    name: string;
    price: number;
    currency: string;
    features: string[];
    highlighted: boolean;
}

/**
 * SSS öğesi
 */
export interface FAQItem {
    question: string;
    answer: string;
    order: number;
}

/**
 * Referans tipi
 */
export interface Testimonial {
    studentName: string;
    content: string;
    rating: number;
    imageUrl?: string;
}

/**
 * Yorum tipi
 */
export interface Review {
    id: string;
    studentId: string;
    coachId: string;
    appointmentId: string;
    rating: number;
    comment?: string;
    createdAt: Timestamp;
}

/**
 * API yanıt tipi
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
}

/**
 * Sayfalama tipi
 */
export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

/**
 * Filtreleme tipi (Koçlar için)
 */
export interface CoachFilters {
    specialties?: string[];
    minExperience?: number;
    maxExperience?: number;
    minRating?: number;
    sortBy?: "rating" | "experience" | "price";
    sortOrder?: "asc" | "desc";
}
