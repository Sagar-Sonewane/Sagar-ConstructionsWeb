# 🏗️ Sagar Constructions — The Sanctuary Builders

> **A professional business website for Sagar Constructions**, a family-owned construction company based in Bhandara, Maharashtra, India. Building homes with trust, care, and quality since 2005.

---

## 📖 About the Project

This is the official website for **Sagar Constructions**, founded by **Mr. Natthuji Sonewane**. The site serves as a digital presence for the business — showcasing services, accepting client inquiries, booking appointments, and facilitating property listings.

Built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, **Supabase**, and **Resend** for email notifications.

---

## ✨ Features

- **Hero Section** — Animated landing with CTA buttons for booking consultations and requesting quotations
- **About Section** — Company story and mission
- **Services** — 6 core services with direct CTA modals
- **Why Choose Us** — Trust indicators and differentiators
- **How We Work** — Step-by-step process guide
- **Property Assistance** — Buy/Sell property request forms with image uploads
- **Testimonials** — Customer reviews
- **Gallery** — Project showcase
- **Founder Story** — Mr. Natthuji Sonewane's background
- **FAQ** — Frequently asked questions
- **Contact Section** — Full contact form with file attachment support
- **Dynamic Modal Forms** — 4 types of modals (Appointment, Quotation, Buy Property, Sell Property)
- **Email Notifications** — Automated email alerts on form submissions via Resend
- **Toast Notifications** — In-app success/error feedback
- **Confetti Animation** — Celebration effect on successful submissions
- **Fully Responsive** — Mobile-first design

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16.2.9 | React framework (App Router) |
| [React](https://react.dev/) | 19.2.4 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | ^5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | ^4 | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | ^12 | Animations & transitions |
| [Supabase](https://supabase.com/) | ^2 | Database (PostgreSQL) + File Storage |
| [Resend](https://resend.com/) | ^6 | Transactional email notifications |
| [Zod](https://zod.dev/) | ^4 | Form validation schemas |
| [Lucide React](https://lucide.dev/) | ^1 | Icon library |
| [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) | ^1.9 | Confetti animation on form success |

---

## 📂 Project Structure

```
sagar-constructions/
├── src/
│   ├── app/
│   │   ├── actions.ts          # Server Actions (form submissions, email, file uploads)
│   │   ├── layout.tsx          # Root layout with metadata & fonts
│   │   ├── page.tsx            # Main single-page composition
│   │   └── globals.css         # Global styles & Tailwind config
│   ├── components/
│   │   ├── Navbar.tsx          # Sticky navigation with mobile menu
│   │   ├── Hero.tsx            # Landing hero section
│   │   ├── About.tsx           # About the company
│   │   ├── Services.tsx        # 6 core service cards
│   │   ├── WhyChooseUs.tsx     # Key differentiators
│   │   ├── HowWeWork.tsx       # Process steps
│   │   ├── PropertyAssistance.tsx # Buy/Sell property section
│   │   ├── Testimonials.tsx    # Customer reviews
│   │   ├── Gallery.tsx         # Project photo gallery
│   │   ├── FounderStory.tsx    # Founder background section
│   │   ├── FAQ.tsx             # FAQ accordion
│   │   ├── Contact.tsx         # Contact form with file uploads
│   │   ├── FormModals.tsx      # Dynamic modal system (4 modal types)
│   │   └── Footer.tsx          # Site footer
│   └── lib/
│       ├── supabase.ts         # Supabase client configuration
│       └── validation/         # Zod validation schemas
├── supabase/
│   └── schema.sql              # Full database schema (run once in Supabase SQL editor)
├── public/                     # Static assets (images, icons)
├── next.config.ts              # Next.js config (Server Actions body limit: 10MB)
├── .env.local                  # Environment variables (not committed)
└── package.json
```

---

## 🗄️ Database Schema

The project uses **Supabase (PostgreSQL)** with 7 tables:

| Table | Purpose |
|---|---|
| `contact_requests` | General contact form submissions |
| `appointments` | Appointment/consultation bookings |
| `consultations` | Detailed construction consultations |
| `quotation_requests` | Service quotation requests |
| `buy_property_requests` | Property buying inquiries |
| `sell_property_requests` | Property selling listings |
| `uploaded_files` | Metadata for uploaded images |

**Storage Buckets:**
- `quotation-images` — Images attached to quotation requests
- `property-images` — Images attached to property listings

All tables have **Row Level Security (RLS)** enabled:
- Public users can **INSERT** (submit forms)
- Authenticated users (admins) can **read and write** all data

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [Supabase](https://supabase.com/) account and project
- A [Resend](https://resend.com/) account for email notifications

### 1. Clone the Repository

```bash
git clone https://github.com/Sagar-Sonewane/Sagar-ConstructionsWeb.git
cd Sagar-ConstructionsWeb
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root with the following keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Notifications (Resend)
RESEND_API_KEY=your_resend_api_key
NOTIFICATION_EMAIL_TO=your_email@example.com
NOTIFICATION_EMAIL_FROM=noreply@yourdomain.com
```

> ⚠️ **Never commit `.env.local` to version control.** It is already in `.gitignore`.

### 4. Set Up the Database

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Open the **SQL Editor**
3. Copy the contents of `supabase/schema.sql`
4. Run the SQL to create all tables, triggers, RLS policies, and storage buckets

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📧 Email Notifications

Every form submission triggers an automated email notification to the business owner using [Resend](https://resend.com/).

Set up your sending domain in Resend and update `NOTIFICATION_EMAIL_FROM` with a verified sender address (e.g., `noreply@yourdomain.com`).

---

## 🏗️ Services Offered

1. **Residential Construction** — Custom home building from foundation to finish
2. **Home Repairs & Care** — Structural repairs, plastering, woodwork
3. **Renovations & Expansion** — Room additions, kitchen remodels, structural updates
4. **Plumbing & Pipelines** — Water pipelines, drainage, bathroom fixtures
5. **Tile & Marble Fitting** — Floor, wall, and countertop tiling
6. **Property Assistance** — Verified property buying and selling in Bhandara

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint checks |

---

## 🌐 Deployment

The easiest way to deploy this project is via **[Vercel](https://vercel.com/)**:

1. Push your code to GitHub
2. Import the repository on [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Deploy!

---

## 🔐 Security Notes

- **`.env.local`** is excluded from git via `.gitignore` — never commit secrets
- All database tables use **Row Level Security (RLS)** — public users can only insert, not read data
- Server Actions validate all inputs using **Zod schemas** before processing
- File uploads are restricted to JPEG, PNG, and WebP formats with a **5MB** size limit

---

## 👨‍💼 About Sagar Constructions

**Sagar Constructions** is a family-owned construction business based in **Bhandara, Maharashtra**, India. Founded by **Mr. Natthuji Sonewane**, the company has been serving local families with honest craftsmanship, quality materials, and transparent dealings for over **20 years**.

📍 **Location:** Bhandara, Maharashtra, India  
📞 **Contact:** Available via the website contact form  
📧 **Email:** sagarsonewane1@gmail.com

---

## 📄 License

This project is private and proprietary. All rights reserved by Sagar Constructions.

---

*Built with ❤️ for the Sonewane family and the people of Bhandara.*
