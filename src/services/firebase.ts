import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAAqNZg-B460X60fTdJvovXMc9SONl1OQI",
  authDomain: "myapp-3b620.firebaseapp.com",
  projectId: "myapp-3b620",
  storageBucket: "myapp-3b620.appspot.com",
  messagingSenderId: "594842001549",
  appId: "1:594842001549:web:786663d96468dbdc6442c4",
  measurementId: "G-SP1XMZ81F8"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
