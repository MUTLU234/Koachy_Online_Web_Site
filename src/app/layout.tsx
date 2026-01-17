import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Koachy - Öğrenci ve Koç Buluşma Platformu",
  description:
    "Üniversite ve lise sınavlarına hazırlanan öğrenciler için uzman koçlarla buluşma platformu. Birebir online koçluk, randevu sistemi ve gelişim takibi.",
  keywords: [
    "koçluk",
    "online eğitim",
    "sınav hazırlık",
    "özel ders",
    "koç",
    "öğrenci",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
