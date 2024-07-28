import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './index.css';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAnlq-bophgbsadZ8t4RsmBG3jnHks5Dro",
  authDomain: "fir-auth-cab38.firebaseapp.com",
  projectId: "fir-auth-cab38",
  storageBucket: "fir-auth-cab38.appspot.com",
  messagingSenderId: "571143035178",
  appId: "1:571143035178:web:a6ca80f8e4665bbda56653",
  measurementId: "G-Q6NJ2M8T21"
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