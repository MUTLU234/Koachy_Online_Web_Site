/**
 * Firestore'a Örnek Koç Verisi Ekleme Script'i
 * 
 * Kullanım: node scripts/seed-coaches.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

async function createCoach(email, password, data) {
    try {
        // Create auth user
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: data.displayName,
            emailVerified: true
        });

        console.log(`✓ Auth user created: ${email}`);

        // Create user document
        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email,
            displayName: data.displayName,
            role: 'coach',
            profilePicUrl: data.profilePicUrl || null,
            phoneNumber: data.phoneNumber || null,
            bio: data.bio || '',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            isActive: true,
            emailVerified: true
        });

        console.log(`✓ User document created`);

        // Create coach document
        await db.collection('coaches').add({
            userId: userRecord.uid,
            specialties: data.specialties,
            experience: data.experience,
            education: data.education,
            rating: data.rating,
            totalReviews: data.totalReviews,
            hourlyRate: data.hourlyRate,
            schedule: data.schedule,
            verified: true,
            verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
            bio: data.bio,
            achievements: data.achievements || [],
            demoVideoUrl: data.demoVideoUrl || null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`✓ Coach document created for ${data.displayName}\n`);
    } catch (error) {
        console.error(`✗ Error creating coach ${email}:`, error.message);
    }
}

const defaultSchedule = {
    monday: {
        available: true,
        slots: [
            { startTime: '09:00', endTime: '10:00', isBooked: false },
            { startTime: '10:00', endTime: '11:00', isBooked: false },
            { startTime: '14:00', endTime: '15:00', isBooked: false },
            { startTime: '15:00', endTime: '16:00', isBooked: false }
        ]
    },
    tuesday: {
        available: true,
        slots: [
            { startTime: '09:00', endTime: '10:00', isBooked: false },
            { startTime: '10:00', endTime: '11:00', isBooked: false },
            { startTime: '14:00', endTime: '15:00', isBooked: false }
        ]
    },
    wednesday: {
        available: true,
        slots: [
            { startTime: '10:00', endTime: '11:00', isBooked: false },
            { startTime: '11:00', endTime: '12:00', isBooked: false },
            { startTime: '15:00', endTime: '16:00', isBooked: false }
        ]
    },
    thursday: {
        available: true,
        slots: [
            { startTime: '09:00', endTime: '10:00', isBooked: false },
            { startTime: '14:00', endTime: '15:00', isBooked: false },
            { startTime: '16:00', endTime: '17:00', isBooked: false }
        ]
    },
    friday: {
        available: true,
        slots: [
            { startTime: '09:00', endTime: '10:00', isBooked: false },
            { startTime: '10:00', endTime: '11:00', isBooked: false }
        ]
    },
    saturday: { available: false, slots: [] },
    sunday: { available: false, slots: [] }
};

async function seedCoaches() {
    console.log('🌱 Starting coach seeding...\n');

    const coaches = [
        {
            email: 'ahmet.yilmaz@koachy.com',
            password: 'Koachy123!',
            data: {
                displayName: 'Ahmet Yılmaz',
                bio: '15 yıllık deneyime sahip matematik öğretmeni. YKS ve LGS Matematik alanında uzmanım.',
                specialties: ['Matematik', 'YKS', 'LGS'],
                experience: 15,
                education: 'İTÜ Matematik Bölümü',
                rating: 4.8,
                totalReviews: 127,
                hourlyRate: 250,
                schedule: defaultSchedule,
                achievements: [
                    '500+ Öğrenci',
                    'YKS Matematik Tam Puan Koçluğu',
                    'TED Üniversitesi Danışmanlık'
                ]
            }
        },
        {
            email: 'zeynep.kaya@koachy.com',
            password: 'Koachy123!',
            data: {
                displayName: 'Zeynep Kaya',
                bio: 'Fizik alanında 10 yıllık öğretmenlik deneyimi. Üniversite hazırlık ve YKS Fizik uzmanı.',
                specialties: ['Fizik', 'YKS', 'Üniversite Hazırlık'],
                experience: 10,
                education: 'ODTÜ Fizik Mühendisliği',
                rating: 4.9,
                totalReviews: 98,
                hourlyRate: 300,
                schedule: defaultSchedule,
                achievements: [
                    '300+ Öğrenci',
                    'YKS Fizik 5 Tam Puan',
                    'Online Eğitim Sertifikası'
                ]
            }
        },
        {
            email: 'mehmet.demir@koachy.com',
            password: 'Koachy123!',
            data: {
                displayName: 'Mehmet Demir',
                bio: 'Kimya ve Biyoloji alanında 12 yıllık deneyim. TYT ve AYT hazırlık konusunda uzmanım.',
                specialties: ['Kimya', 'Biyoloji', 'TYT', 'AYT'],
                experience: 12,
                education: 'Hacettepe Üniversitesi Kimya',
                rating: 4.7,
                totalReviews: 156,
                hourlyRate: 280,
                schedule: defaultSchedule,
                achievements: [
                    '400+ Öğrenci',
                    'TYT Fen 3 Tam Puan',
                    'Milli Eğitim Sertifikalı'
                ]
            }
        },
        {
            email: 'ayse.arslan@koachy.com',
            password: 'Koachy123!',
            data: {
                displayName: 'Ayşe Arslan',
                bio: 'İngilizce öğretmeni. YDS, YÖKDİL ve TOEFL hazırlık konusunda 8 yıllık deneyim.',
                specialties: ['İngilizce', 'YDS', 'TOEFL'],
                experience: 8,
                education: 'Boğaziçi Üniversitesi İngiliz Dili ve Edebiyatı',
                rating: 4.9,
                totalReviews: 203,
                hourlyRate: 320,
                schedule: defaultSchedule,
                achievements: [
                    '600+ Öğrenci',
                    'CELTA Sertifikalı',
                    'YDS 10 kez 100 puan koçluğu'
                ]
            }
        },
        {
            email: 'can.ozturk@koachy.com',
            password: 'Koachy123!',
            data: {
                displayName: 'Can Öztürk',
                bio: 'Edebiyat ve Türkçe öğretmeni. AYT Edebiyat ve TYT Türkçe alanında 7 yıllık deneyim.',
                specialties: ['Edebiyat', 'Türkçe', 'AYT'],
                experience: 7,
                education: 'Ankara Üniversitesi Türk Dili ve Edebiyatı',
                rating: 4.6,
                totalReviews: 89,
                hourlyRate: 240,
                schedule: defaultSchedule,
                achievements: [
                    '250+ Öğrenci',
                    'AYT Edebiyat Tam Puan',
                    'Dil ve Edebiyat Derneği Üyesi'
                ]
            }
        }
    ];

    for (const coach of coaches) {
        await createCoach(coach.email, coach.password, coach.data);
    }

    console.log('✅ Seeding completed!');
    console.log(`\n📊 Total coaches created: ${coaches.length}`);
    console.log('\n🔐 Login credentials:');
    coaches.forEach(c => {
        console.log(`   ${c.email} / ${c.password}`);
    });

    process.exit(0);
}

seedCoaches().catch(error => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
});
