import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNoSY-1olWjIJELB33dEgnNUa1LgHeE5g",
  authDomain: "sbd-torrens.firebaseapp.com",
  projectId: "sbd-torrens",
  storageBucket: "sbd-torrens.appspot.com",
  messagingSenderId: "861072095968",
  appId: "1:861072095968:web:77c9390cc9963f59ff6e85"
};

const firebaseApp = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(firebaseApp);
export default firebaseApp