# 🎓 Koachy - Online Coaching Platform

A modern web platform that provides one-on-one online coaching for students preparing for university and high school entrance exams, featuring expert coach matching and progress tracking.

> **[🇹🇷 Türkçe README için tıklayın](README.tr.md)**

## ✨ Features

- 🎯 **Student-Coach Matching**: Advanced filtering by subject, experience, and rating
- 📅 **Smart Appointment System**: Conflict prevention algorithm with real-time availability
- 💬 **Real-time Messaging**: Firebase Realtime Database integration
- 📚 **Study Materials & Reports**: PDF/Video sharing and progress tracking
- 💳 **Secure Payment**: Stripe and Iyzico integration
- 🎨 **Dynamic CMS**: Homepage management from admin panel
- 🔐 **Enterprise-level Security**: XSS, Injection protection, RBAC

## 📸 Screenshots

Live functionality showcase of the platform:

````carousel
![Homepage Hero Section: Modern and attractive design welcoming students. "Let's Reach Success Together" message with stats showing 150+ expert coaches, 500+ students, and 95% success rate.](images/02-hero-section.png)

<!-- slide -->

![Platform Features: Modern cards presenting core features like expert coaches, personal planning, and progress tracking.](images/03-features.png)

<!-- slide -->

![Pricing & Popular Coaches: Starter (1,500₺), Pro (2,500₺), and Elite (4.000₺) packages with popular coach profile cards.](images/04-pricing.png)

<!-- slide -->

![Coaches Listing: Advanced filtering system (expertise area, hourly rate, minimum rating) on coach search page. Detailed information cards for each coach.](images/05-coaches-listing.png)

<!-- slide -->

![Coach Profile Detail: Ayşe Arslan's profile - 8 years experience, 4.9 rating, 203 reviews. Appointment booking system and availability calendar displayed.](images/06-coach-profile.png)

<!-- slide -->

![Login Page: Email/password login and Google sign-in options. Features "Remember Me" and "Forgot Password" functionality.](images/07-login.png)

<!-- slide -->

![Registration Page: Sign up form for Student or Coach roles. Includes full name, email, phone, password fields and terms acceptance.](images/08-register.png)

<!-- slide -->

![Homepage - Full View: Comprehensive homepage view showcasing all platform sections.](images/01-homepage.png)
````

> [!NOTE]
> These screenshots were taken from the **live, fully functional** platform. All features are active and operational.

## 🛠️ Technology Stack

- **Frontend**: Next.js 14+ (App Router), React 18+, TypeScript
- **Styling**: Tailwind CSS, Custom Design System
- **Backend**: Firebase (Auth, Firestore, Functions, Storage)
- **Payment**: Stripe API
- **Testing**: Playwright (E2E), Vitest (Unit)
- **Deployment**: Vercel

## 🚀 Installation

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Firebase account
- Stripe account (Test/Production)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/MUTLU234/koachy-web.git
   cd koachy-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Open `.env.local` and add your API keys:
   - Firebase credentials
   - Stripe keys
   - NextAuth secret

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will be running at [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```
koachy-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages
│   │   ├── (dashboard)/       # Dashboard pages
│   │   └── (public)/          # Public pages
│   ├── features/              # Feature modules
│   │   ├── auth/
│   │   ├── coaches/
│   │   ├── appointments/
│   │   ├── messaging/
│   │   ├── payments/
│   │   └── cms/
│   ├── components/            # Shared components
│   │   ├── ui/
│   │   └── layout/
│   ├── lib/                   # Utilities
│   │   ├── firebase/
│   │   ├── validations/
│   │   └── security/
│   ├── hooks/                 # Custom hooks
│   └── types/                 # TypeScript types
├── firebase/                  # Firebase config
├── tests/                     # Test files
└── docs/                      # Documentation
```

## 🧪 Testing

```bash
# Run E2E tests
npm run test:e2e

# Run unit tests
npm run test:unit

# Run all tests
npm test
```

## 🏗️ Build

```bash
# Production build
npm run build

# Production preview
npm start
```

## 🎨 Design System

### Color Palette

- **Primary**: `#4F46E5` (Indigo)
- **Background**: `#F9FAFB` (Light Gray)
- **Accent**: `#10B981` (Green)

### Font Family

- **Sans**: Inter, Poppins
- **Display**: Poppins, Inter

## 🔐 Security

- ✅ Input Validation (Zod)
- ✅ XSS Protection
- ✅ SQL/NoSQL Injection Prevention
- ✅ CSRF Protection
- ✅ Rate Limiting
- ✅ RBAC (Role-Based Access Control)
- ✅ Firebase Security Rules
- ✅ Audit Logging

## 📝 Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run format       # Prettier
npm run test         # Run tests
npm run test:e2e     # E2E tests
npm run test:unit    # Unit tests
```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Nurettin Mutlu Tüver**

- LinkedIn: [linkedin.com/in/nurettin-mutlu-tüver](https://www.linkedin.com/in/nurettin-mutlu-tüver)
- GitHub: [@MUTLU234](https://github.com/MUTLU234)

## 📞 Contact

For questions or collaboration opportunities, feel free to reach out via LinkedIn or GitHub.

---

⭐ If you found this project helpful, please consider giving it a star!

## 🌟 Key Highlights

- **Full-stack Application**: Built with modern web technologies
- **Real-time Features**: Live messaging and notifications
- **Production-ready**: Comprehensive testing and security measures
- **Scalable Architecture**: Modular design with clean separation of concerns
- **Professional UI/UX**: Modern design with excellent user experience
