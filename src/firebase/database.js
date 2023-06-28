import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDB4Frw5Z19M4uJg8KTrqKtj60075oEgwI",
  authDomain: "mittchat-7ebe4.firebaseapp.com",
  projectId: "mittchat-7ebe4",
  storageBucket: "mittchat-7ebe4.appspot.com",
  messagingSenderId: "139209299470",
  appId: "1:139209299470:web:ac575917aff04b515e8e5f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const dataBase = getFirestore(app);
export const auth = getAuth(app);