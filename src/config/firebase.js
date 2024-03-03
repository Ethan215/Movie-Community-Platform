// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPE6agexP4XaVqG1odyDUUzWclbmavrxU",
  authDomain: "cs35-final-project-3c948.firebaseapp.com",
  projectId: "cs35-final-project-3c948",
  storageBucket: "cs35-final-project-3c948.appspot.com",
  messagingSenderId: "437850697830",
  appId: "1:437850697830:web:6228297b8b23d7b95ebda7",
  measurementId: "G-JTR13SSVHH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
