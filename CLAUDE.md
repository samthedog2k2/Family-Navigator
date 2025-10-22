# Family Navigator Project Memory

## Project Overview
**Type:** Next.js 14 application with Firebase backend
**Purpose:** Family management and planning tool
**Users:** Private family app (4 users)
**Tech Stack:** Next.js 14, Firebase 10, TypeScript, TailwindCSS
**Repository:** https://github.com/samthedog2k2/Family-Navigator
**Firebase Project ID:** studio-5461927014-a4c9a

## Project Structure
```
Family-Navigator/
├── src/
│   ├── app/              # Next.js 14 app router pages
│   │   ├── health/       # Health tracking module
│   │   ├── calendar/     # Calendar events module
│   │   ├── weather/      # Weather information module
│   │   └── travel/       # Travel planning module
│   ├── components/       # React components
│   └── lib/
│       ├── firebase.ts   # Firebase initialization
│       └── types.ts      # TypeScript types
├── .env.local           # Firebase credentials (NEVER COMMIT)
└── package.json         # Dependencies and scripts
```

## Important Files
- See @package.json for available npm scripts
- See @src/lib/firebase.ts for Firebase configuration
- See @src/lib/types.ts for TypeScript interfaces

## Firebase Structure
**Database:** Cloud Firestore

Collections:
- `/users` - User profiles with roles (admin/member/viewer)
- `/health` - Health tracking data
- `/calendar` - Family calendar events
- `/weather` - Weather preferences
- `/travel` - Travel plans

**Authentication:** Firebase Auth with Google OAuth

## Available Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
firebase deploy      # Deploy to Firebase hosting
```

## Development Guidelines

### Firebase Best Practices
- All Firebase operations must include error handling
- Use client-side Firebase initialization only (no SSR)
- Use dynamic imports for Firebase modules
- Test Firestore security rules before deploying
- Always check user authentication before database operations

### Security Requirements
- All routes require authentication except landing page
- Role-based access control: admin > member > viewer
- Encrypt sensitive data before storing in Firestore
- No API keys or secrets in client-side code

### TypeScript Standards
- Use TypeScript strict mode
- Define interfaces for all data structures
- Type all function parameters and return values

### Styling with TailwindCSS
- Use only core Tailwind utility classes (no custom compilation)
- Keep responsive design in mind (mobile-first)

## Common Development Tasks

### Adding a New Feature Module
1. Create component directory: `/src/components/[feature]/`
2. Create page: `/src/app/[feature]/page.tsx`
3. Define TypeScript types in `/src/lib/types.ts`
4. Create Firestore collection if needed
5. Update Firebase security rules
6. Add navigation links
7. Test authentication and authorization

### Deploying to Production
```bash
npm run build
npm run start  # Test production build
firebase deploy --only hosting
```

## Integration Points
- **n8n Automation Server:** http://64.181.197.144:5678
- **GitHub Repository:** https://github.com/samthedog2k2/Family-Navigator
- **Firebase Console:** https://console.firebase.google.com/project/studio-5461927014-a4c9a

## Known Issues & Solutions

### Issue: "Internal Server Error" on pages
**Solution:** Firebase must be initialized client-side only. Use dynamic imports or 'use client' directive.

### Issue: TailwindCSS classes not working
**Solution:** Only core Tailwind classes are available. No custom configuration.

## Environment Variables Required
```bash
# .env.local (NEVER commit this file)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Family Members & Roles
- **Admin:** samthedog2k2@gmail.com (full access)
- **Members:** (to be added - read/write access)
- **Viewers:** (to be added - read-only access)

## Code Version Control
- GitHub Token: Stored securely (not in code)
- All changes committed with descriptive messages
- Main branch is production-ready
