"use client";

import { useState, useEffect } from "react";
import FilterSidebar from "@/components/coaches/FilterSidebar";
import CoachCard from "@/components/coaches/CoachCard";
import { getCoaches, type CoachWithUser, type CoachFilterOptions } from "@/lib/firebase/coaches";

export default function CoachesPage() {
    const [coaches, setCoaches] = useState<CoachWithUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<CoachFilterOptions>({});

    const fetchCoaches = async (filterOptions: CoachFilterOptions = {}) => {
        setLoading(true);
        try {
            const data = await getCoaches(filterOptions);
            setCoaches(data);
        } catch (error) {
            console.error("Koçlar yüklenirken hata:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoaches();
    }, []);

    const handleFilterChange = (newFilters: CoachFilterOptions) => {
        setFilters(newFilters);
        fetchCoaches(newFilters);
    };

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="mb-6">
                            <h1 className="text-3xl font-display font-bold text-gray-900">
                                Uzman Koçlarımız
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Hedeflerinize ulaşmanız için size en uygun koçu bulun.
                            </p>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="h-[400px] bg-gray-100 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : coaches.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {coaches.map((coach) => (
                                    <CoachCard key={coach.id} coach={coach} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🔍</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Sonuç Bulunamadı</h3>
                                <p className="text-gray-500 mt-2">
                                    Seçtiğiniz kriterlere uygun koç bulunmamaktadır.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
