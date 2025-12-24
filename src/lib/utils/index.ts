import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS sınıflarını birleştirmek için yardımcı fonksiyon
 * @param inputs - CSS sınıfları
 * @returns Birleştirilmiş CSS sınıfları
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Tarih formatlama fonksiyonu
 * @param date - Formatlanacak tarih
 * @param locale - Dil (varsayılan: tr-TR)
 * @returns Formatlanmış tarih
 */
export function formatDate(date: Date | string, locale: string = "tr-TR"): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(d);
}

/**
 * Tarih ve saat formatlama fonksiyonu
 * @param date - Formatlanacak tarih
 * @param locale - Dil (varsayılan: tr-TR)
 * @returns Formatlanmış tarih ve saat
 */
export function formatDateTime(date: Date | string, locale: string = "tr-TR"): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(d);
}

/**
 * Sayıyı para birimi olarak formatlama
 * @param amount - Miktar
 * @param currency - Para birimi (varsayılan: TRY)
 * @returns Formatlanmış para
 */
export function formatCurrency(amount: number, currency: string = "TRY"): string {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency,
    }).format(amount);
}

/**
 * İsimlerin ilk harflerini büyük yapma
 * @param str - Metin
 * @returns Formatlanmış metin
 */
export function capitalizeWords(str: string): string {
    return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

/**
 * E-posta maskeleme (güvenlik için)
 * @param email - E-posta adresi
 * @returns Maskelenmiş e-posta
 */
export function maskEmail(email: string): string {
    const [username, domain] = email.split("@");
    if (!username || !domain) return email;

    const maskedUsername = username.charAt(0) + "***" + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
}

/**
 * Telefon numarası formatlama
 * @param phone - Telefon numarası
 * @returns Formatlanmış telefon
 */
export function formatPhoneNumber(phone: string): string {
    // Türkiye formatı: (5XX) XXX XX XX
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);

    if (match) {
        return `(${match[1]}) ${match[2]} ${match[3]} ${match[4]}`;
    }

    return phone;
}

/**
 * Slug oluşturma (URL-friendly)
 * @param text - Metin
 * @returns Slug
 */
export function createSlug(text: string): string {
    const turkishChars: { [key: string]: string } = {
        'ç': 'c', 'Ç': 'C',
        'ğ': 'g', 'Ğ': 'G',
        'ı': 'i', 'İ': 'I',
        'ö': 'o', 'Ö': 'O',
        'ş': 's', 'Ş': 'S',
        'ü': 'u', 'Ü': 'U',
    };

    return text
        .split('')
        .map(char => turkishChars[char] || char)
        .join('')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Rastgele ID oluşturma
 * @param length - Uzunluk (varsayılan: 8)
 * @returns Rastgele ID
 */
export function generateId(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Debounce fonksiyonu
 * @param func - Fonksiyon
 * @param wait - Bekleme süresi (ms)
 * @returns Debounced fonksiyon
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Metni keserek kısaltma
 * @param text - Metin
 * @param maxLength - Maksimum uzunluk
 * @returns Kısaltılmış metin
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}
