/* eslint-disable no-unused-vars */
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


// src/main.jsx
import React from "react";
import ReactDOMClient from "react-dom/client";
import MyApp from "./myApp"; //Imports the MyApp component from the seperate file (Vite converts to JS)
import "./main.css";


// Create the container
const container = document.getElementById("root");

// Create a root
const root = ReactDOMClient.createRoot(container);

// Initial render: Render an element to the Root
root.render(<MyApp />);