// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBH0qNYNjFoyBJyYUPbseEu9U_3gj_wpng",
  authDomain: "fir-crud-app-fb841.firebaseapp.com",
  projectId: "fir-crud-app-fb841",
  storageBucket: "fir-crud-app-fb841.firebasestorage.app",
  messagingSenderId: "269907956998",
  appId: "1:269907956998:web:56913d3341ed25c23dfa87",
  measurementId: "G-2SWHKBYXP6"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;