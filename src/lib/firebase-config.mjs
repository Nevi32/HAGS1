import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAgLjhgeWoCZcJ_E-dANgbbU70FTa0svmU",
    authDomain: "symbiotstore.firebaseapp.com",
    projectId: "symbiotstore",
    storageBucket: "symbiotstore.appspot.com",
    messagingSenderId: "193175655146",
    appId: "1:193175655146:web:d615ac8c030e31790f7d93",
    measurementId: "G-ZVNNEYJ854"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };