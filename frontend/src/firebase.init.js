
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEFRfVjjkahNNeWS9kowRPt1_v6djuYjM",
  authDomain: "cartnest-e4302.firebaseapp.com",
  projectId: "cartnest-e4302",
  storageBucket: "cartnest-e4302.appspot.com",
  messagingSenderId: "79120932130",
  appId: "1:79120932130:web:8b83ea393926820830197b",
  measurementId: "G-NWYPWT5FVR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
// const analytics = getAnalytics(app);
