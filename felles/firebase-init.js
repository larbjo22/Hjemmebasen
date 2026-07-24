// ── firebase-init.js ─────────────────────────────────────────
// Initialiserer Firebase-appen. Config-objektet er OFFENTLIG by design –
// all sikkerhet ligger i security rules (database.rules.json).
// Analytics lastes bevisst ikke (ingen sporing i appene).
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';

export const firebaseConfig = {
  apiKey: 'AIzaSyBvC7SSwjBtqWDB-OQEdKFMOV54fQtQQOw',
  authDomain: 'hjemmebasen-12fc3.firebaseapp.com',
  databaseURL: 'https://hjemmebasen-12fc3-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'hjemmebasen-12fc3',
  storageBucket: 'hjemmebasen-12fc3.firebasestorage.app',
  messagingSenderId: '375213042887',
  appId: '1:375213042887:web:7ce764c20c3739e0bf62e2',
};

export const app = initializeApp(firebaseConfig);
