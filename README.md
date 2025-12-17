# Consultadd Discovery Platform

A clean, modern call management and analysis platform for tracking sales calls and gaining insights across industry sectors.

## Features

- **Simple Authentication** - Email/password login with session management
- **Industry Dashboard** - Browse sectors with visual icons and analytics
- **Sector Analytics** - Interactive charts showing subcategory distribution and common problems
- **Company Management** - View company details and call history
- **Call Analysis** - Detailed transcript analysis with problems, solutions, and takeaways
- **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI**: shadcn/ui components
- **Charts**: Recharts
- **State**: React Hooks

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and login with any email/password.

## Project Structure

```
app/
├── page.tsx                    # Login page
├── sector/[sectorId]/         # Sector analytics & companies
├── company/[companyId]/       # Call history
└── call/[callId]/             # Call transcript analysis

components/
├── ui/                        # shadcn/ui components
└── shared/                    # Custom components

lib/
├── api.ts                     # API utilities
├── auth.ts                    # Authentication
└── utils.ts                   # Utilities
```

## Environment

Create `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=https://discovery-call-backend.onrender.com
```

---
**Consultadd © 2024**
