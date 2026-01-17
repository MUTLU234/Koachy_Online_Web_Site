// Bu dosya Tailwind v4 geçişi sırasında tamamen yeniden yazıldı
// Tüm bg-primary, text-primary, border-primary → indigo-600 ile değiştirildi

"use client";

import type { CoachFilterOptions } from "@/lib/firebase/coaches";

interface FilterSidebarProps {
    filters: CoachFilterOptions;
    onFilterChange: (filters: CoachFilterOptions) => void;
}

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
    const specialties = [
        "Matematik",
        "Fizik",
        "Kimya",
        "Biyoloji",
        "Türkçe",
        "Edebiyat",
        "Tarih",
        "Coğrafya",
        "İngilizce",
        "Geometri",
    ];

    const examTypes = [
        "YKS (TYT)",
        "YKS (AYT)",
        "LGS",
        "KPSS",
        "DGS",
        "ALES",
    ];

    const handleSpecialtyToggle = (specialty: string) => {
        const current = filters.specialties || [];
        const updated = current.includes(specialty)
            ? current.filter(s => s !== specialty)
            : [...current, specialty];
        onFilterChange({ ...filters, specialties: updated });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900">Filtreler</h2>
            </div>

            {/* Specialties */}
            <div>
                <h3 className="font-semibold text-gray-900 mb-3">Uzmanlık Alanı</h3>
                <div className="space-y-2">
                    {specialties.map((specialty) => (
                        <label key={specialty} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={(filters?.specialties || []).includes(specialty)}
                                onChange={() => handleSpecialtyToggle(specialty)}
                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span className="text-sm text-gray-700">{specialty}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-semibold text-gray-900 mb-3">Saatlik Ücret (₺)</h3>
                <div className="space-y-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice || ""}
                        onChange={(e) => onFilterChange({ ...filters, minPrice: Number(e.target.value) || undefined })}
                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice || ""}
                        onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) || undefined })}
                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
                    />
                </div>
            </div>

            {/* Rating */}
            <div>
                <h3 className="font-semibold text-gray-900 mb-3">Minimum Puan</h3>
                <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={filters.minRating || 0}
                    onChange={(e) => onFilterChange({ ...filters, minRating: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>0.0</span>
                    <span className="font-semibold">{(filters.minRating || 0).toFixed(1)}</span>
                    <span>5.0</span>
                </div>
            </div>

            {/* Exam Types */}
            <div>
                <h3 className="font-semibold text-gray-900 mb-3">Sınav Türü</h3>
                <div className="space-y-2">
                    {examTypes.map((exam) => (
                        <label key={exam} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="examType"
                                value={exam}
                                checked={filters.examType === exam}
                                onChange={(e) => onFilterChange({ ...filters, examType: e.target.value })}
                                className="w-4 h-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span className="text-sm text-gray-700">{exam}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            <button
                onClick={() => onFilterChange({})}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
                Filtreleri Temizle
            </button>
        </div>
    );
}
