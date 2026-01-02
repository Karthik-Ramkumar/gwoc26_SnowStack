# Firebase Authentication Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard (you can disable Google Analytics if not needed)

## Step 2: Enable Authentication Methods

1. In your Firebase project, go to **Build** > **Authentication**
2. Click on the **Sign-in method** tab
3. Enable the following providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and provide a project support email

## Step 3: Register Your Web App

1. In the Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click on the **Web** icon (`</>`)
4. Register your app with a nickname (e.g., "Basho Frontend")
5. **Copy the Firebase configuration object** - you'll need this next

## Step 4: Configure Environment Variables

1. Copy the `.env.example` file to create `.env.local`:
   ```bash
   copy frontend\.env.example frontend\.env.local
   ```

2. Open `frontend/.env.local` and replace the placeholder values with your actual Firebase credentials:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_actual_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_actual_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
   REACT_APP_FIREBASE_APP_ID=your_actual_app_id
   ```

3. **Save the file** - the `.env.local` file is already in `.gitignore` so your credentials won't be committed

## Step 5: Restart the Development Server

Since you added new environment variables, you need to restart your React development server:

1. Stop the current server (Ctrl+C in the terminal where `npm start` is running)
2. Start it again:
   ```bash
   cd frontend
   npm start
   ```

## Step 6: Test Authentication

1. Navigate to `http://localhost:3000`
2. Click the **Login** button in the navigation
3. Try creating a new account or signing in with Google
4. All existing pages remain accessible without login! ✅

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure you created the `.env.local` file in the `frontend/` directory
- Check that all environment variables are properly set
- Restart the development server

### Google Sign-In Not Working
- Make sure Google provider is enabled in Firebase Console
- Check that you've added a support email in the Google sign-in settings
- Add `http://localhost:3000` to authorized domains in Firebase Console > Authentication > Settings > Authorized domains

### User Not Staying Logged In
- Clear your browser cache and cookies
- Check browser console for any errors

## Next Steps

- Customize the user profile page with workshop registration history
- Add form auto-fill functionality for logged-in users
- Integrate order tracking features

---

**Need help?** Check the [Firebase Authentication Documentation](https://firebase.google.com/docs/auth/web/start)
