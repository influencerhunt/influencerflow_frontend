# InfluencerFlow Frontend

A Next.js frontend application with role-based authentication that communicates with the FastAPI backend.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Role-based authentication** (Admin, Influencer, Brand, User)
- **Supabase** integration for authentication
- **Axios** for API communication
- **React Context** for state management

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Required environment variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_BACKEND_API_URL=http://localhost:8000/api/v1
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## Project Structure

```
influencerflow_frontend/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── dashboard/       # Protected dashboard page
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ui/            # UI components
│   │   ├── LoginForm.tsx  # Login form
│   │   ├── SignupForm.tsx # Signup form
│   │   └── Navbar.tsx     # Navigation bar
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   └── lib/               # Utility libraries
│       ├── api.ts         # API client
│       ├── supabase.ts    # Supabase client
│       └── utils.ts       # Utility functions
├── middleware.ts          # Next.js middleware for route protection
└── README.md             # This file
```

## Authentication Flow

1. **Frontend** collects user credentials
2. **Next.js API** (server-side) communicates with FastAPI backend
3. **FastAPI** validates with Supabase and returns JWT tokens
4. **Frontend** stores tokens and manages auth state
5. **Route protection** based on user roles

## User Roles

- **USER**: Basic platform access
- **INFLUENCER**: Content creation and brand collaboration features
- **BRAND**: Influencer discovery and campaign management
- **ADMIN**: Full platform administration

## Development

- The frontend runs on `http://localhost:3000`
- The backend should run on `http://localhost:8000`
- Make sure both servers are running for full functionality

## API Integration

The frontend communicates with the FastAPI backend through:
- Server-side API routes in Next.js
- Axios HTTP client with automatic token handling
- Role-based route protection

## Build

```bash
npm run build
```

## Deploy

The app can be deployed to Vercel, Netlify, or any other Next.js hosting platform.

Make sure to set the environment variables in your deployment platform.
