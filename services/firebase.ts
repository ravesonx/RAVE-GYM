import AsyncStorage from "@react-native-async-storage/async-storage";
import { Auth, browserLocalPersistence, getAuth, getReactNativePersistence, initializeAuth, setPersistence } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { Firestore, getFirestore, initializeFirestore } from "firebase/firestore";
import { Platform } from "react-native";

// TODO: Replace with your actual Firebase config
export const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

let app: firebase.app.App;
let auth: Auth;
let db: Firestore;

// Initialize Firebase (Compat)
if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

// Initialize Modular Auth
if (Platform.OS === 'web') {
    auth = getAuth(app as any); // cast for compat/modular interop
    setPersistence(auth, browserLocalPersistence);
} else {
    try {
        auth = initializeAuth(app as any, {
            persistence: getReactNativePersistence(AsyncStorage)
        });
    } catch (e: any) {
        if (e.code === 'auth/already-initialized') {
            auth = getAuth(app as any);
            setPersistence(auth, getReactNativePersistence(AsyncStorage));
        } else {
            console.error("Firebase Auth Init Error:", e);
            throw e;
        }
    }
}

// Initialize Firestore
try {
    db = initializeFirestore(app as any, {
        experimentalForceLongPolling: true,
    });
} catch (e: any) {
    db = getFirestore(app as any);
}

export { app, auth, db };

