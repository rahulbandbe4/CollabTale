import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCg4MDZbWAqAfFkQ3zvaKhLYBea-ORC_yE",
  authDomain: "collabtale-4c24f.firebaseapp.com",
  projectId: "collabtale-4c24f",
  storageBucket: "collabtale-4c24f.appspot.com",
  messagingSenderId: "224542140876",
  appId: "1:224542140876:web:18e8f76277c1578c16d569",
  measurementId: "G-B5F21WP4L5"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const firebaseAuth = getAuth(app);
const firestoreDB = getFirestore(app);

export { app, firebaseAuth, firestoreDB, firebaseConfig };