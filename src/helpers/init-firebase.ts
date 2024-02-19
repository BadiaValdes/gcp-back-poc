import { initializeApp } from 'firebase/app';
import * as admin from 'firebase-admin';

const firebaseConfig = {
    apiKey: "AIzaSyBmsUlsWQd4eX0rTKrslWnp7CGTef6jSNs", //apikey
    authDomain: "cdt-principal.firebaseapp.com" //authdomain
};

export const firebaseAdmin = admin.initializeApp({
    projectId: "cdt-principal",
});
  
export const app = initializeApp(firebaseConfig);