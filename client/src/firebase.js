// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nextstep-76f53.firebaseapp.com",
  projectId: "nextstep-76f53",
  storageBucket: "nextstep-76f53.appspot.com",
  messagingSenderId: "679349598785",
  appId: "1:679349598785:web:860caf1a706b787e91e4c0",
  measurementId: "G-LJP0S52MET",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
