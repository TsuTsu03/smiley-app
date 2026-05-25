# DentaFlow — Dental Clinic Management System (MVP Frontend)

A clean, beautiful dental clinic management app built with Next.js 14, TypeScript, and Tailwind CSS.

## 🦷 Features

### Multi-Portal System
- **Admin Portal** — Dashboard, appointments, patient list, register patients, dentist schedules, send SMS/email reminders
- **Dentist Portal** — Today's schedule, full appointment list, patient records (all dentists), add medical records
- **Patient Portal** — Health overview, medical records, book by date or by dentist

### Key Features
- Color theme based on dental psychology (trust/cleanliness: teal/mint palette)
- Clinic-branded subdomains (e.g., `brightsmile.dentaflow.app`)
- Patient login via Full Name + Date of Birth
- Adjustment reminders with compose and send UI
- Cross-dentist patient records access

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🔑 Demo Credentials

### Admin
- Email: `admin@brightsmile.com`
- Password: `admin123`

### Dentist
- Email: `maria@brightsmile.com`
- Password: `dentist123`

### Patient
- Full Name: `Juan dela Cruz`
- Date of Birth: `1990-03-15`

## 🏗 Tech Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (icons)
- **DM Serif Display + DM Sans** (Google Fonts)

## 📁 Structure
```
src/
  app/          — Next.js app router
  components/
    admin/      — Admin dashboard pages
    dentist/    — Dentist dashboard pages
    patient/    — Patient dashboard pages
    ui/         — Shared UI components
  lib/
    data.ts     — Mock data + types
    auth.tsx    — Auth context
  styles/
    globals.css — Global styles + CSS vars
```

## 🎨 Design Decisions
- **Color Psychology**: Teal/mint palette evokes trust, cleanliness, and calm — ideal for healthcare
- **Minimal branding**: "DentaFlow" is small/secondary; clinic name is prominent
- **Simple UX**: Clean tables, modals, and forms — no overwhelming complexity
- **Patient privacy**: Credentials are name + DOB (no email/password to remember)
