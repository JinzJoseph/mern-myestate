// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-24dc5.firebaseapp.com",
  projectId: "mern-estate-24dc5",
  storageBucket: "mern-estate-24dc5.appspot.com",
  messagingSenderId: "98984949746",
  appId: "1:98984949746:web:da73bb8a78c39af258dd6b"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);