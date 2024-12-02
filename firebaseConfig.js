// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTlJ8Ke-Vbs7QJKbv2CD6vDW6iVkD6azM",
  authDomain: "wavechat-a468a.firebaseapp.com",
  projectId: "wavechat-a468a",
  storageBucket: "wavechat-a468a.firebasestorage.app",
  messagingSenderId: "996218751216",
  appId: "1:996218751216:web:d33db53cf48631181e1a35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage) // Enable persistence
});

export const db = getFirestore(app);

export const userRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');