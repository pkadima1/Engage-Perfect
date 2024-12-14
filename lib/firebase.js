import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCCdSlqGXKOu2GXgR_PmB6d_uJsrff2dRU",
    authDomain: "perfectpost-9e5e8.firebaseapp.com",
    projectId: "perfectpost-9e5e8",
    storageBucket: "perfectpost-9e5e8.firebasestorage.app",
    messagingSenderId: "953139222342",
    appId: "1:953139222342:web:34e5225706423f90653747",
    measurementId: "G-K8NFQDM2ZF"
};

// Initialize Firebase only if it hasn't been initialized already
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    // Only initialize analytics in the browser
    if (typeof window !== 'undefined') {
        const analytics = getAnalytics(app);
    }
} else {
    app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;