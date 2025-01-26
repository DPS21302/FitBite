import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './index.css';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBug6BxKeoImEq6IqI1_EcdS58UoVkpQyg",
  authDomain: "fitbite-63fb4.firebaseapp.com",
  projectId: "fitbite-63fb4",
  storageBucket: "fitbite-63fb4.firebasestorage.app",
  messagingSenderId: "775090710556",
  appId: "1:775090710556:web:85f316947c7a1a048a57d9",
  measurementId: "G-R2ZJNDRYRM"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);