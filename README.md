# Memento Mori Machine

> *"Your life is made of weeks. Every square is a small piece of your finite time."*

**Memento Mori Machine** is an immersive, privacy-first life visualization experience built with Next.js (App Router), TypeScript, and Tailwind CSS. It visualizes your past weeks, current week, and estimated future weeks as a responsive, interactive calendar designed with a dark editorial aesthetic.

---

## Features

- **Onboarding Experience**: Minimalist first-visit entrance with validation, lifespan scale setting, and strict client-side privacy disclosure.
- **The Life Grid**:
  - 52 columns per row, with each row representing one year of life.
  - Distinguishes past weeks, the current week (subtle warm amber pulse), and estimated future weeks.
  - Interactive week inspection with accessible labels, keyboard navigation (Tab/Arrows/Enter/Escape), and tooltips.
  - **Year Focus Mode**: Zoom in to any individual year of life to view its 52 weeks in expanded calendar detail.
  - **Life Chapters**: Configurable markers for Childhood (0–12), Adolescence (13–19), Early Adulthood (20–35), Midlife (36–59), and Later Life (60+).
- **Live Statistics**:
  - Elapsed calendar weeks & days lived.
  - Current age in years and days.
  - Live second-by-second countdown to the user's next birthday.
- **A Different Perspective Engine**:
  - Seasons passed, full moon cycles witnessed, conscious waking weeks vs. resting weeks.
  - The "52 Sundays" reflection.
  - **Horizon / Milestone Distance Calculator**: Measure exact weeks and days remaining until any milestone date (or elapsed since past ones).
- **Weeks Worth Remembering (Memory Archive)**:
  - Anchor memories to any week (title, reflections, and optional specific date).
  - Memory markers (amber pips) on the grid.
  - Chronological timeline with search and direct navigation to any week on the grid.
  - In-place creation, editing, and deletion with confirmation.
- **Settings & Data Management**:
  - Update birth date and estimated lifespan (50–110 years).
  - Toggle chapter dividers and reduced motion preferences.
  - **JSON Export & Import**: Full data portability with strict schema validation.
  - **Reset Application**: Complete erasure with double confirmation.
- **100% Client-Side Privacy**: No external tracking, no backend database, no telemetry.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 with custom dark editorial theme
- **Typography**: Google Fonts (*Newsreader* serif + *Geist* sans)
- **Icons**: Lucide React
- **Date Utilities**: date-fns
- **Testing**: Vitest

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
npm test
```

### 3. Run Production Build & Type Check
```bash
npm run build
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
