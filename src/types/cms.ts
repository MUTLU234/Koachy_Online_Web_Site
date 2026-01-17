export interface HeroSection {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
}

export interface StatsSection {
    coaches: string;
    students: string;
    successRate: string;
}

export interface Feature {
    title: string;
    description: string;
    icon: string;
}

export interface SiteContent {
    hero: HeroSection;
    stats: StatsSection;
    features: Feature[];
    updatedAt: Date;
    updatedBy: "system";
}

export const defaultSiteContent: SiteContent = {
    hero: {
        title: "Hedeflerinize Ulaşın",
        subtitle: "Uzman Koçlarla Birlikte",
        ctaPrimary: "Hemen Başla",
        ctaSecondary: "Koçları Keşfet"
    },
    stats: {
        coaches: "100+",
        students: "500+",
        successRate: "%95"
    },
    features: [
        {
            title: "Uzman Koçlar",
            description: "Alanında deneyimli, sınavlarda başarı kanıtlamış koçlardan birebir destek alın",
            icon: "user-group"
        },
        {
            title: "Kişisel Planlama",
            description: "Size özel hazırlanan çalışma programları ile hedeflerinize adım adım ilerleyin",
            icon: "calendar"
        },
        {
            title: "Gelişim Takibi",
            description: "Düzenli deneme analizleri ve gelişim raporları ile eksiklerinizi anında tespit edin",
            icon: "chart"
        }
    ],
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedBy: "system"
};
