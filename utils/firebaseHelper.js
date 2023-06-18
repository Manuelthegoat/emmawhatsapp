// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

export const getFirebaseApp = () => {
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyBM3FNUFEk0yGGwqnS5TKqTyZd5ETH8R0Y",
        authDomain: "whatsapp-2a2ad.firebaseapp.com",
        projectId: "whatsapp-2a2ad",
        storageBucket: "whatsapp-2a2ad.appspot.com",
        messagingSenderId: "374741866471",
        appId: "1:374741866471:web:a85e59dccbab81e8da8f42",
        measurementId: "G-S0K5GS21Z7",
    };

    // Initialize Firebase
    return initializeApp(firebaseConfig);
};
