# 🌱 CarbonSense

> Track, Reduce, and Share your personal carbon footprint with AI-powered insights tailored for India.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google)

**CarbonSense** is a full-stack web application designed to help users understand their environmental impact. Unlike generic carbon calculators, CarbonSense is built with **India-specific emission factors** and features a personalized **AI Carbon Coach** powered by Google Gemini to give you actionable, lifestyle-appropriate reduction strategies.

---

## ✨ Key Features

- **🇮🇳 India-Specific Baselines**: Calculates emissions based on local context (e.g., state-specific electricity grid factors, LPG vs. Induction cooking, local transit options like Auto-Rickshaws and Metro).
- **🤖 AI Carbon Coach (Gemini)**: A conversational AI that analyzes your tracked activities and suggests realistic, high-impact reductions.
- **📊 Real-time Carbon Gauge & Dashboard**: Visualizes your daily and monthly footprint with beautifully animated SVG gauges and Framer Motion spring physics.
- **🔄 Visceral Equivalents**: Translates abstract "kg CO₂" numbers into relatable metrics (e.g., "Equivalent to charging your phone 340 times").
- **⚡ Quick Logging**: One-tap activity logging for common daily actions (Metro rides, Veg meals, AC usage) with an animated leaf-burst confirmation.
- **🏆 Green Challenges & Leaderboard**: Join community challenges (like "Meat-Free Week" or "Car-Free Monday") and track your progress against friends.
- **💳 Shareable Carbon Card**: Auto-generates a stunning, 3D-flipping digital card summarizing your monthly impact, ready to be downloaded or shared on WhatsApp and LinkedIn.

---

## 🛠️ Tech Stack

CarbonSense is built on a modern, edge-ready tech stack designed for speed, beautiful UI, and easy deployment.

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 & Custom CSS Modules (Glassmorphism, CSS Variables)
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React
- **Database & ORM:** PostgreSQL + Prisma (v5)
- **Authentication:** Supabase Auth *(Prepared)*
- **AI Integration:** Google Generative AI (Gemini 2.0 Flash)

---

## 🚀 Getting Started

Follow these steps to run the CarbonSense prototype locally.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/CarbonSense.git
cd CarbonSense/app
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Ensure your `.env.local` file is set up in the root of the `app` directory. You will need a Google Gemini API key for the AI Coach to function.
\`\`\`env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_postgres_db_url
\`\`\`
*(Note: The current prototype uses local storage for immediate testing, but the Prisma schema and Supabase clients are ready for production).*

### 4. Database Setup (Optional for prototype)
Generate the Prisma client:
\`\`\`bash
npx prisma generate
\`\`\`

### 5. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to start your green journey!

---

## 📂 Project Structure

\`\`\`text
app/
├── prisma/                 # Prisma schema for Supabase Postgres
├── src/
│   ├── app/                # Next.js App Router pages (Dashboard, Log, Coach, Auth, etc.)
│   ├── components/         # Reusable React components
│   │   ├── layout/         # Navbar, FAB
│   │   ├── providers/      # Theme Provider (Dark/Light mode)
│   │   └── ui/             # Animated Counters, Carbon Gauge, Glass Cards
│   └── lib/                # Core business logic
│       ├── store.tsx       # Global state management (Context API)
│       ├── emission-factors.ts # India-specific CO2 data
│       ├── baseline-calculator.ts # Footprint estimation logic
│       └── carbon-equivalents.ts # Abstract data translation
\`\`\`

---

## 🎨 Design Philosophy

The UI is built around an **"Earth-Forward"** aesthetic:
- **Colors:** Deep forest greens, earth ambers, and clean whites/darks.
- **Glassmorphism:** Frosted glass cards that blend with an ambient, subtly animated aurora background.
- **Typography:** A combination of *Sora* (Display), *Inter* (Body), and *JetBrains Mono* (Data/Numbers) for a highly legible, premium feel.

---

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Let's build a greener future together!

## 📄 License
[MIT](https://choosealicense.com/licenses/mit/)
