// src/main.jsx
import React from "react";
import ReactDOMClient from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login.jsx"
import App from "./App.jsx"

export default function Main() {
    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path = "/"
                    element = {<Login />}
                />
                <Route
                    path = "/login"
                    element = {<Login />}
                />
                <Route
                    path = "/dashboard"
                    element = {<App />}
                /> 
            </Routes>
        </BrowserRouter>
    );
}

const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);
root.render(
    <React.StrictMode>
        <Main />
    </React.StrictMode>
);