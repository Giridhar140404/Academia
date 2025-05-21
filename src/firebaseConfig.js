// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOEEcn2DZJnSN8vQZkY5CQKNeiVZSsYfk",
  authDomain: "academia-47356.firebaseapp.com",
  databaseURL: "https://academia-47356-default-rtdb.firebaseio.com",
  projectId: "academia-47356",
  storageBucket: "academia-47356.firebasestorage.app",
  messagingSenderId: "643776098446",
  appId: "1:643776098446:web:804d2de532b8545c1399df",
  measurementId: "G-BEKHC86P38",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { auth, googleProvider, db, analytics };
