# Consultadd Discovery Platform

A comprehensive call management and analysis platform for tracking sales calls, analyzing client interactions, and gaining insights across different industry sectors.

## 🚀 Features

### Authentication & User Management

- ✅ Secure login with email/password
- ✅ User profile display (name, email, role)
- ✅ Protected routes with automatic redirection
- ✅ Persistent session management

### Dashboard & Analytics

- ✅ **Sector Overview** - Browse 6 industry sectors (Healthcare, Finance, Technology, Retail, Manufacturing, Education)
- ✅ **Sector Analytics** - Visual insights with interactive pie charts
  - Subcategory distribution
  - Problem frequency analysis
  - Common vs unique problems
- ✅ **Company Management** - Detailed company information and call history

### Call Transcript Analysis

- ✅ **AI-Powered Analysis** with comprehensive insights:
  - Executive summary (max 300 characters)
  - Client problems categorized by urgency (Immediate/Long-Term)
  - Solutions pitched with fit assessment
  - Competitor mentions with sentiment analysis
  - Detailed analysis table with client reactions
  - Key takeaways and follow-up actions
- ✅ **AI Chat Assistant** - Ask questions about call transcripts
- ✅ **Interactive Tabs** - Easy navigation between different analysis views

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) with Turbopack
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Charts**: Recharts with shadcn chart components
- **State Management**: React Hooks
- **Build Tool**: Turbopack (Next.js 15)

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎯 Quick Start

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Open your browser**

   - Navigate to [http://localhost:3000](http://localhost:3000)

3. **Login**

   - Enter any email (e.g., `john.doe@consultadd.com`)
   - Enter any password
   - Your name will be extracted from the email

4. **Explore the platform**
   - Dashboard → Select a sector
   - View analytics or browse companies
   - Click on a company to see call history
   - Click on a call to see detailed analysis

## 📁 Project Structure

```
consultadd-discovery/
├── app/
│   ├── page.tsx                    # Login page
│   ├── dashboard/                  # Sectors dashboard
│   ├── sector/[sectorId]/         # Sector analytics & companies
│   ├── company/[companyId]/       # Call history
│   └── call/[callId]/             # Call transcript analysis
├── components/
│   ├── ui/                        # shadcn/ui components
│   └── navbar.tsx                 # Reusable navigation bar
├── lib/
│   ├── utils.ts                   # Utility functions
│   └── auth.ts                    # Authentication helpers
├── types/
│   └── index.ts                   # TypeScript interfaces
└── public/                        # Static assets
```

## 🎨 UI Components

All components from shadcn/ui:

- `button` - Interactive buttons with variants
- `card` - Content containers
- `input` - Form inputs
- `label` - Form labels
- `badge` - Status indicators
- `chart` - Chart components (Recharts wrapper)
- `form` - Form handling with validation
- `select` - Dropdown selects
- `textarea` - Multi-line text inputs
- `separator` - Visual dividers
- `skeleton` - Loading placeholders
- `alert` - Alert messages
- `table` - Data tables

## 🔌 API Integration

### Environment Setup

Create `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=https://discovery-call-backend-latest-1.onrender.com/api
```

### API Endpoints

```
GET  /api/industries                    # List all industries
GET  /api/calls/industry/:industryCode  # Get calls by industry
GET  /api/calls                         # Get all calls
GET  /api/calls/:callId                 # Get specific call details
```

### Route Structure

```
/                                    # Login page
/dashboard                           # Industries dashboard
/sector/:industryCode                # Sector analytics & companies
/company/:companyName                # Company call history
/call/:callId                        # Call transcript analysis
```

### Call Response Format (camelCase)

```json
{
  "id": "string",
  "companyName": "string",
  "stage": "string",
  "notesLink": "string",
  "createdAt": "string",
  "companyClassification": {
    "domain": "string",
    "industry": "string",
    "subIndustry": "string"
  },
  "callSummary": "string",
  "clientRepresentative": {
    "name": "string",
    "title": "string | null",
    "department": "string | null"
  },
  "consultAddRepresentative": "string",
  "clientProblems": [
    {
      "problemStatement": "string",
      "tag": "Immediate Problem | Long-Term Problem",
      "category": "string",
      "industryContext": "string"
    }
  ],
  "solutionsPitched": [
    {
      "solutionDescription": "string",
      "addressedProblem": "string",
      "fitLabel": "Immediate Fit | Future Fit"
    }
  ],
  "competitorsMentioned": [
    {
      "competitorName": "string",
      "context": "string",
      "sentiment": "Positive | Neutral | Negative"
    }
  ],
  "summaryRows": [
    {
      "problem": "string",
      "solutionPitched": "string",
      "clientObjection": "string",
      "objectionHandling": "string | null",
      "clientReaction": "string"
    }
  ],
  "keyTakeaways": ["string"],
  "followUpActions": ["string"],
  "solutionDelivered": "string | null"
}
```

## 🎯 Key Features Explained

### 1. Sector Analytics

- **Subcategory Distribution**: Visual breakdown of company types within each sector
- **Problem Analysis**: Identify common pain points across companies
- **Severity Tracking**: High/Medium/Low severity indicators
- **Unique Problems**: Company-specific challenges

### 2. Call Analysis

- **Problem Categorization**: 7 main categories

  - Process inefficiency
  - Customer experience gaps
  - Data fragmentation
  - Integration challenges
  - Scalability limitations
  - Reporting/analytics limitations
  - Workforce or training issues

- **Solution Fit Assessment**:

  - Immediate Fit: Addressed during the call
  - Future Fit: To be explored later

- **Client Reaction Analysis**:
  - Positive: Affirming language, increased engagement
  - Neutral: Acknowledgment without commitment
  - Negative: Hesitation, concerns raised

### 3. AI Chat Assistant

- Ask questions about call transcripts
- Get instant answers about problems, solutions, reactions
- Context-aware responses based on full transcript

## 🚀 Optimizations & Best Practices

### Performance

- ✅ Server-side rendering with Next.js 15
- ✅ Turbopack for faster builds
- ✅ Code splitting and lazy loading
- ✅ Optimized images and assets

### Code Quality

- ✅ TypeScript for type safety
- ✅ ESLint for code linting
- ✅ Consistent component structure
- ✅ Reusable components (Navbar, etc.)
- ✅ Centralized auth utilities

### UX/UI

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Loading states and error handling
- ✅ Consistent navigation
- ✅ User info display in navbar
- ✅ Sticky navigation bar

### Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Color contrast compliance

## 📝 Development Commands

```bash
npm run dev      # Start dev server (with Turbopack)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🔧 Troubleshooting

### Port already in use

```bash
lsof -ti:3000 | xargs kill -9
```

### Clear Next.js cache

```bash
rm -rf .next
npm run dev
```

### Reinstall dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

MIT License - Consultadd © 2024

## 🤝 Contributing

This is a proprietary project for Consultadd. For internal contributions, please follow the company's development guidelines.

---

**Built with ❤️ by Consultadd Team**
