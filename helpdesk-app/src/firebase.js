// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA3k3OiVCT1qEVlIGEaNqps02bD9VC-w3Q",
    authDomain: "helpdesk-app-a65b2.firebaseapp.com",
    projectId: "helpdesk-app-a65b2",
    storageBucket: "helpdesk-app-a65b2.appspot.com",
    messagingSenderId: "270549086864",
    appId: "1:270549086864:web:084ce5e2fcc0f3a1245e15",
    measurementId: "G-Z3N13YCX5E"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
