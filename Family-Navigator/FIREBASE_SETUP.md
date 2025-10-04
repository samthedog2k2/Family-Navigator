# 🔥 Firebase Configuration Setup Guide

This guide will help you set up Firebase for the Family Navigator application.

## 📋 Prerequisites

- A Google account
- Access to [Firebase Console](https://console.firebase.google.com/)

---

## 🚀 Quick Start

### Step 1: Create/Select Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Follow the setup wizard (you can disable Google Analytics for development)

### Step 2: Enable Required Services

#### Enable Firestore Database
1. In Firebase Console, go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** for development (secure it later!)
4. Select a Cloud Firestore location close to your users

#### Enable Authentication
1. Go to **Build → Authentication**
2. Click **"Get started"**
3. Enable sign-in methods you want:
   - Email/Password
   - Google (recommended)

### Step 3: Get Web App Configuration

1. In Firebase Console, click ⚙️ **Settings** → **Project settings**
2. Scroll to **"Your apps"** section
3. If you don't have a web app:
   - Click the **</>** (Web) icon
   - Register app name (e.g., "Family Navigator")
   - Click **"Register app"**
4. Copy the `firebaseConfig` object

### Step 4: Create .env.local File

1. Copy the template:
   ```bash
   cp .env.local.template .env.local
   ```

2. Open `.env.local` and fill in your values from the `firebaseConfig`:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaXXXXXXXXXXXXXXX
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:xxxxx
   ```

### Step 5: (Optional) Admin SDK Setup

For server-side operations:

1. In Firebase Console, go to **Settings → Service accounts**
2. Click **"Generate new private key"**
3. Click **"Generate key"** to download JSON file
4. Open the JSON file and add to `.env.local`:

   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

   **OR** use the entire JSON as a string:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"..."}
   ```

### Step 6: Configure Firestore Security Rules

1. Go to **Firestore Database → Rules**
2. For development, you can use:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

   ⚠️ **Important**: This allows all authenticated users to read/write. Secure this for production!

### Step 7: Start Your Application

```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

---

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Firestore Database enabled
- [ ] Authentication enabled
- [ ] Web app registered in Firebase
- [ ] `.env.local` file created with all required variables
- [ ] `.env.local` is listed in `.gitignore` (already done)
- [ ] Dev server starts without Firebase errors
- [ ] Can access the application at http://localhost:3000

---

## 🔐 Security Best Practices

### Development
- ✅ Use test mode for Firestore (easy testing)
- ✅ Use separate Firebase projects for dev/staging/production
- ✅ Never commit `.env.local` to Git (already protected by `.gitignore`)

### Production
- ⚠️ **Update Firestore Security Rules** to restrict access
- ⚠️ **Add your domain** to Firebase's authorized domains
- ⚠️ **Rotate API keys** if they're ever exposed
- ⚠️ **Enable App Check** to protect against abuse
- ⚠️ **Use environment variables** in your hosting platform

---

## 📚 Helpful Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

## 🐛 Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- ✅ Check that `NEXT_PUBLIC_FIREBASE_API_KEY` is set correctly
- ✅ Make sure the API key starts with `AIza`
- ✅ Restart the dev server after changing `.env.local`

### Error: "Firebase: Error (auth/operation-not-allowed)"
- ✅ Enable the authentication method in Firebase Console
- ✅ Go to Authentication → Sign-in method → Enable desired providers

### Error: "Missing or insufficient permissions"
- ✅ Check Firestore Security Rules
- ✅ Make sure user is authenticated
- ✅ Update rules to allow read/write for testing

### Changes to .env.local not taking effect
- ✅ Restart the development server (`Ctrl+C` then `npm run dev`)
- ✅ Clear `.next` folder: `rm -rf .next && npm run dev`
- ✅ Check for typos in variable names

---

## 🎯 Next Steps After Setup

1. **Test Authentication**: Try signing up/in with a test account
2. **Test Database**: Create some family member data
3. **Explore Features**: Try the health tracker, calendar, and travel features
4. **Customize**: Update the app with your family's information
5. **Deploy**: When ready, deploy to Vercel/Netlify with production Firebase config

---

**Need help?** Check the troubleshooting section or create an issue in the repository.
