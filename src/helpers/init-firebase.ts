import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyBmsUlsWQd4eX0rTKrslWnp7CGTef6jSNs", //apikey
    authDomain: "cdt-principal.firebaseapp.com" //authdomain
};

export const app = initializeApp(firebaseConfig);