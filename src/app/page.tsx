import Link from "next/link";
import { getSiteContent } from "@/lib/firebase/cms";
import { defaultSiteContent } from "@/types/cms";
import { getCoaches } from "@/lib/firebase/coaches";
import CoachCard from "@/components/coaches/CoachCard";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const iconMap: Record<string, string> = {
  "user-group": "👥",
  "calendar": "📅",
  "chart": "📊",
};

export default async function HomePage() {
  const content = await getSiteContent().catch(() => defaultSiteContent);
  const allCoaches = await getCoaches();
  const popularCoaches = allCoaches.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Koachy
            </Link>
            <div className="flex gap-3">
              <Link href="/giris" className="px-5 py-2 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
                Giriş Yap
              </Link>
              <Link href="/kayit" className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all">
                Kayıt Ol
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {content.hero.title}
                </span>
                <span className="block mt-2 text-gray-900">{content.hero.subtitle}</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                Üniversite ve lise sınavlarına hazırlanan öğrenciler için birebir online koçluk platformu
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href="/kayit" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all text-center">
                  {content.hero.ctaPrimary}
                </Link>
                <Link href="/koclar" className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl border-2 border-indigo-600 hover:bg-indigo-50 transition-colors text-center">
                  {content.hero.ctaSecondary}
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">{content.stats.coaches}</div>
                  <div className="text-sm text-gray-600 font-medium">Uzman Koç</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">{content.stats.students}</div>
                  <div className="text-sm text-gray-600 font-medium">Öğrenci</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">{content.stats.successRate}</div>
                  <div className="text-sm text-gray-600 font-medium">Başarı Oranı</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Platform <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Özellikleri</span>
              </h2>
              <p className="text-lg text-gray-600visit max-w-2xl mx-auto">Başarıya ulaşmanız için ihtiyacınız olan her şey</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.features.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${index === 1 ? 'bg-gradient-to-br from-green-500 to-emerald-500' : 'bg-gradient-to-br from-indigo-500 to-purple-500'}`}>
                    <span className="text-4xl">{iconMap[feature.icon] || iconMap['user-group']}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Coaches */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Popüler <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Koçlarımız</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Öğrencilerimizin en çok tercih ettiği ve en yüksek puanlı koçlarımızla tanışın
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularCoaches.map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/koclar" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all">
                Tüm Koçları Gör
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                Size Uygun <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Paketi Seçin</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                İhtiyacınıza en uygun koçluk paketini seçin
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Basic */}
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Başlangıç</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-gray-900">1.500</span>
                  <span className="text-xl text-gray-600 ml-2">₺/ay</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {["Haftalık 1 Görüşme", "Kişisel Program", "Aylık Rapor"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/kayit" className="block w-full text-center px-6 py-3 bg-gray-100 text-indigo-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                  Seç
                </Link>
              </div>

              {/* Pro - Highlighted */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-2xl transform md:-translate-y-4 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  En Popüler
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Pro Paket</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-white">2.500</span>
                  <span className="text-xl text-indigo-100 ml-2">₺/ay</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {["Haftalık 2 Görüşme", "Kişisel Program", "Haftalık Rapor", "7/24 Destek"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white">
                      <svg className="w-5 h-5 text-green-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/kayit" className="block w-full text-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                  Seç
                </Link>
              </div>

              {/* Elite */}
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Elite</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-gray-900">4.000</span>
                  <span className="text-xl text-gray-600 ml-2">₺/ay</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {["Sınırsız Görüşme", "Kişisel Program", "Günlük Takip", "Özel Sınavlar"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/kayit" className="block w-full text-center px-6 py-3 bg-gray-100 text-indigo-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                  Seç
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 lg:p-16 text-center shadow-2xl">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Başarı Yolculuğunuza Hemen Başlayın
              </h2>
              <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Binlerce öğrenci hedeflerine Koachy ile ulaştı. Sıra sizde!
              </p>
              <Link href="/kayit" className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-lg">
                Ücretsiz Kayıt Ol
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">&copy; 2025 Koachy. Tüm hakları saklıdır.</p>
            <div className="flex flex-wrap gap-6 justify-center text-sm">
              <Link href="/hakkimizda" className="text-gray-600 hover:text-indigo-600 transition-colors">Hakkımızda</Link>
              <Link href="/iletisim" className="text-gray-600 hover:text-indigo-600 transition-colors">İletişim</Link>
              <Link href="/gizlilik-politikasi" className="text-gray-600 hover:text-indigo-600 transition-colors">Gizlilik</Link>
              <Link href="/kullanim-kosullari" className="text-gray-600 hover:text-indigo-600 transition-colors">Koşullar</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
