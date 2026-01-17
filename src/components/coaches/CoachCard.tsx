import Link from "next/link";
import Image from "next/image";
import type { CoachWithUser } from "@/lib/firebase/coaches";

interface CoachCardProps {
    coach: CoachWithUser;
}

export default function CoachCard({ coach }: CoachCardProps) {
    return (
        <div className="card group hover:shadow-lg transition-all duration-300 bg-white border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-6 flex flex-col h-full">
                {/* Header: Image & Name */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm">
                            {coach.user.profilePicUrl ? (
                                <Image
                                    src={coach.user.profilePicUrl}
                                    alt={coach.user.displayName}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 text-xl font-bold">
                                    {coach.user.displayName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        {coach.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-white" title="Onaylı Koç">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                            {coach.user.displayName}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1">
                            {coach.education}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-semibold text-gray-900">{coach.rating.toFixed(1)}</span>
                            <span className="text-xs text-gray-500">({coach.totalReviews} değerlendirme)</span>
                        </div>
                    </div>
                </div>

                {/* Specialties */}
                <div className="mb-4 flex-1">
                    <div className="flex flex-wrap gap-2">
                        {coach.specialties.slice(0, 3).map((spec, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md font-medium"
                            >
                                {spec}
                            </span>
                        ))}
                        {coach.specialties.length > 3 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-400 text-xs rounded-md font-medium">
                                +{coach.specialties.length - 3}
                            </span>
                        )}
                    </div>
                </div>

                {/* Footer: Price & Action */}
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                    <div>
                        <p className="text-xs text-gray-500">Saatlik Ücret</p>
                        <p className="text-lg font-bold text-indigo-600">
                            ₺{coach.hourlyRate}
                        </p>
                    </div>
                    <Link
                        href={`/koclar/${coach.id}`}
                        className="btn-secondary text-sm px-4 py-2"
                    >
                        Profili Gör
                    </Link>
                </div>
            </div>
        </div>
    );
}
