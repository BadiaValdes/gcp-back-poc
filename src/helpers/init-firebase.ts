import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "", //apikey
    authDomain: "" //authdomain
};

export const app = initializeApp(firebaseConfig);