#!/bin/bash

# Update package.json to always use port 9002
cat > package.json << 'PACKAGE'
{
  "name": "nextn",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 9002",
    "build": "next build",
    "start": "next start -p 9002",
    "lint": "next lint"
  },
  "dependencies": {
    "@genkit-ai/ai": "^0.9.4",
    "@genkit-ai/core": "^0.9.4",
    "@genkit-ai/firebase": "^0.9.4",
    "@genkit-ai/googleai": "^0.9.4",
    "@hookform/resolvers": "^3.9.1",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-toast": "^1.2.4",
    "@sparticuz/chromium": "^140.0.0",
    "cheerio": "^1.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "firebase": "^11.1.0",
    "firebase-admin": "^13.0.2",
    "framer-motion": "^11.15.0",
    "genkit": "^0.9.4",
    "lucide-react": "^0.469.0",
    "next": "15.5.4",
    "puppeteer-core": "^24.22.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.54.2",
    "recharts": "^2.15.0",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^8",
    "eslint-config-next": "15.5.4",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
PACKAGE

echo "Updated package.json to use port 9002"
rm -rf .next
echo "Cleared cache"
