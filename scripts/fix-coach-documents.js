/**
 * Eksik Coach Document'lerini Tamamlama Script'i
 * 
 * Sorun: Auth kullanıcıları var ama Firestore coaches collection'ında document yok
 * Çözüm: Mevcut Auth kullanıcıları için coaches document oluştur
 */

const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();
const auth = admin.auth();

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

const coachData = {
    'ahmet.yilmaz@koachy.com': {
        displayName: 'Ahmet Yılmaz',
        bio: '15 yıllık deneyime sahip matematik öğretmeni. YKS ve LGS Matematik alanında uzmanım.',
        specialties: ['Matematik', 'YKS', 'LGS'],
        experience: 15,
        education: 'İTÜ Matematik Bölümü',
        rating: 4.8,
        totalReviews: 127,
        hourlyRate: 250,
        achievements: ['500+ Öğrenci', 'YKS Matematik Tam Puan Koçluğu']
    },
    'zeynep.kaya@koachy.com': {
        displayName: 'Zeynep Kaya',
        bio: 'Fizik alanında 10 yıllık öğretmenlik deneyimi.',
        specialties: ['Fizik', 'YKS'],
        experience: 10,
        education: 'ODTÜ Fizik Mühendisliği',
        rating: 4.9,
        totalReviews: 98,
        hourlyRate: 300,
        achievements: ['300+ Öğrenci', 'YKS Fizik 5 Tam Puan']
    },
    'mehmet.demir@koachy.com': {
        displayName: 'Mehmet Demir',
        bio: 'Kimya ve Biyoloji alanında 12 yıllık deneyim.',
        specialties: ['Kimya', 'Biyoloji', 'TYT', 'AYT'],
        experience: 12,
        education: 'Hacettepe Üniversitesi Kimya',
        rating: 4.7,
        totalReviews: 156,
        hourlyRate: 280,
        achievements: ['400+ Öğrenci', 'TYT Fen 3 Tam Puan']
    },
    'ayse.arslan@koachy.com': {
        displayName: 'Ayşe Arslan',
        bio: 'İngilizce öğretmeni. YDS, YÖKDİL ve TOEFL hazırlık.',
        specialties: ['İngilizce', 'YDS', 'TOEFL'],
        experience: 8,
        education: 'Boğaziçi Üniversitesi İngiliz Dili ve Edebiyatı',
        rating: 4.9,
        totalReviews: 203,
        hourlyRate: 320,
        achievements: ['600+ Öğrenci', 'CELTA Sertifikalı']
    },
    'can.ozturk@koachy.com': {
        displayName: 'Can Öztürk',
        bio: 'Edebiyat ve Türkçe öğretmeni.',
        specialties: ['Edebiyat', 'Türkçe', 'AYT'],
        experience: 7,
        education: 'Ankara Üniversitesi Türk Dili ve Edebiyatı',
        rating: 4.6,
        totalReviews: 89,
        hourlyRate: 240,
        achievements: ['250+ Öğrenci', 'AYT Edebiyat Tam Puan']
    }
};

async function fixCoachDocuments() {
    console.log('🔧 Fixing missing coach documents...\n');

    try {
        // Get all coach users from Auth
        const listUsersResult = await auth.listUsers();
        const coachUsers = listUsersResult.users.filter(user =>
            user.email && Object.keys(coachData).includes(user.email)
        );

        console.log(`Found ${coachUsers.length} coach users in Auth\n`);

        for (const user of coachUsers) {
            const email = user.email;
            const uid = user.uid;
            const data = coachData[email];

            console.log(`Processing: ${email} (UID: ${uid})`);

            //  Check if coaches document exists
            const coachQuery = await db.collection('coaches')
                .where('userId', '==', uid)
                .get();

            if (coachQuery.empty) {
                console.log(`  ⚠️  Coaches document missing - creating...`);

                // Create coaches document
                await db.collection('coaches').add({
                    userId: uid,
                    specialties: data.specialties,
                    experience: data.experience,
                    education: data.education,
                    rating: data.rating,
                    totalReviews: data.totalReviews,
                    hourlyRate: data.hourlyRate,
                    schedule: defaultSchedule,
                    verified: true,
                    verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
                    bio: data.bio,
                    achievements: data.achievements || [],
                    demoVideoUrl: null,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });

                console.log(`  ✅ Coach document created!\n`);
            } else {
                console.log(`  ✓ Coach document already exists\n`);
            }
        }

        console.log('✅ All coach documents fixed!');
        console.log(`📊 Total coaches processed: ${coachUsers.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixCoachDocuments();
