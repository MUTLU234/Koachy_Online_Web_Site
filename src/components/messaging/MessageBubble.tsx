// Date-fns: Tarih formatlama kütüphanesi
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";
// Türkçe yerelleştirme
import { tr } from "date-fns/locale";
// Firebase Firestore'dan Timestamp tipi
import { Timestamp } from "firebase/firestore";

// MessageBubble component'inin props (özellik) tanımları
interface MessageBubbleProps {
    message: {
        id: string;           // Mesajın benzersiz ID'si
        senderId: string;     // Mesajı gönderen kişinin ID'si
        senderName: string;   // Gönderenin adı
        text: string;         // Mesajın içeriği (metin)
        timestamp: Timestamp; // Mesajın gönderilme zamanı
        read: boolean;        // Mesaj okundu mu? (✓✓ göstergesi için)
    };
    isOwnMessage: boolean;    // Bu mesaj kullanıcının kendi mesajı mı?
    showAvatar?: boolean;     // Avatar gösterilsin mi? (opsiyonel, varsayılan: true)
    senderPhoto?: string;     // Gönderenin profil fotoğrafı URL'i (opsiyonel)
}

// MessageBubble component'i - Tek bir mesaj balonunu render eder
export default function MessageBubble({
    message,
    isOwnMessage,
    showAvatar = true,        // Varsayılan değer: true
    senderPhoto,
}: MessageBubbleProps) {

    // Mesaj zamanını kullanıcı dostu formata çevirir
    // Örn: "14:30", "Dün 14:30", "25 Ara 14:30"
    const formatMessageTime = (timestamp: Timestamp) => {
        // Timestamp yoksa boş string döndür
        if (!timestamp) return "";

        // Timestamp'i JavaScript Date objesine çevir
        const date = timestamp.toDate();

        // Bugün ise sadece saat göster (örn: "14:30")
        if (isToday(date)) {
            return format(date, "HH:mm", { locale: tr });
        }
        // Dün ise "Dün 14:30" formatında göster
        else if (isYesterday(date)) {
            return `Dün ${format(date, "HH:mm", { locale: tr })}`;
        }
        // Daha eski ise "25 Ara 14:30" formatında göster
        else {
            return format(date, "dd MMM HH:mm", { locale: tr });
        }
    };

    return (
        // Ana mesaj container'ı
        // isOwnMessage true ise: sağa hizalı (flex-row-reverse)
        // isOwnMessage false ise: sola hizalí (flex-row)
        <div className={`flex gap-2 ${isOwnMessage ? "flex-row-reverse" : "flex-row"} mb-3`}>

            {/* Avatar (Profil Fotoğrafı) Bölümü */}
            {showAvatar && (
                <div className="flex-shrink-0"> {/* Küçülmeyi engelle */}
                    {senderPhoto ? (
                        // Eğer profil fotoğrafı varsa, göster
                        <img
                            src={senderPhoto}
                            alt={message.senderName}
                            className="w-8 h-8 rounded-full object-cover" // 32px yuvarlak avatar
                        />
                    ) : (
                        // Profil fotoğrafı yoksa, ismin ilk harfini göster
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold text-sm">
                            {message.senderName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
            )}

            {/* Mesaj Balonu ve İçerik Bölümü */}
            <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"}`}>
                {/* Gönderen adı - Sadece karşı tarafın mesajlarında göster */}
                {!isOwnMessage && (
                    <span className="text-xs text-gray-500 mb-1 px-1">{message.senderName}</span>
                )}

                {/* Mesaj Balonu (Bubble) */}
                <div
                    className={`px-4 py-2 rounded-2xl ${isOwnMessage
                        // KENDİ MESAJIMIZ: Mor gradient arka plan + beyaz yazı + sağ alt köşe kesik
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm"
                        // KARŞIDAN GELEN MESAJ: Gri arka plan + koyu yazı + sol alt köşe kesik
                        : "bg-gray-100 text-gray-900 rounded-bl-sm"
                        }`}
                >
                    {/* ⚠️ SORUN BURADA: text-white HER ZAMAN AKTIF! */}
                    {/* Hem kendi mesajımızda hem karşıdan gelen mesajda beyaz text oluyor */}
                    {/* Bu yüzden karşıdan gelen mesajlar (gri arka plan + beyaz text) okunmuyor */}
                    {/* <p className="text-sm whitespace-pre-wrap break-words text-white">{message.text}</p> */}

                    {/* ✅ ÇÖZÜM: Yukarıdaki satırı şöyle değiştir: */}
                    <p className={`text-sm whitespace-pre-wrap break-words ${isOwnMessage ? "text-white" : "text-gray-900"}`}>
                        {message.text}
                    </p>
                </div>

                {/* Zaman Damgası ve Okundu Göstergesi */}
                <div className="flex items-center gap-1 mt-1 px-1">
                    {/* Mesaj zamanı (örn: "14:30" veya "Dün 14:30") */}
                    <span className="text-xs text-gray-400">
                        {formatMessageTime(message.timestamp)}
                    </span>

                    {/* Okundu göstergesi - Sadece kendi mesajlarımızda göster */}
                    {isOwnMessage && (
                        <span className="text-xs">
                            {message.read ? (
                                // Mesaj okunmuş: Çift tik (✓✓) mavi renkte
                                <span className="text-blue-500" title="Okundu">✓✓</span>
                            ) : (
                                // Mesaj gönderilmiş ama okunmamış: Tek tik (✓) gri renkte
                                <span className="text-gray-400" title="Gönderildi">✓</span>
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
