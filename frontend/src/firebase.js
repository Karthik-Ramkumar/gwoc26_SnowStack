// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Check if Firebase credentials are properly configured
// Don't initialize if credentials are missing or are placeholder values
const isFirebaseConfigured =
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'your_api_key_here' &&
    firebaseConfig.apiKey !== 'undefined' &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== 'your_project_id_here' &&
    firebaseConfig.projectId !== 'undefined' &&
    firebaseConfig.authDomain &&
    firebaseConfig.authDomain.includes('.firebaseapp.com');

// Initialize Firebase only if properly configured
let app = null;
let auth = null;

if (isFirebaseConfigured) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        console.log('✅ Firebase initialized successfully');
    } catch (error) {
        console.warn('⚠️ Firebase initialization failed:', error.message);
        console.warn('Authentication features will be disabled');
    }
} else {
    console.warn('⚠️ Firebase credentials not configured');
    console.warn('Firebase authentication features will be disabled until you configure credentials');
    console.warn('📖 See FIREBASE_SETUP.md for setup instructions');
}

export { auth, isFirebaseConfigured };
export default app;
