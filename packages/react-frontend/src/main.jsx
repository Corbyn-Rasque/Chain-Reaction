// src/main.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";
import ReactDOMClient from "react-dom/client";
import App from "./App"; //Imports the MyApp component from the seperate file (Vite converts to JS)
// import "./main.css";


// Create the container
const container = document.getElementById("root");

// Create a root
const root = ReactDOMClient.createRoot(container);

// Initial render: Render an element to the Root
root.render(<App />);