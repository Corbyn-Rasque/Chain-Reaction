/* eslint-disable no-unused-vars */
 
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';
import Login from "./webpages/login";
import TaskPage from './webpages/taskPage';

// Default first page loaded is login
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = (username, password) => {
        // Simulate login process (replace with real authentication logic)
        if (username === "admin" && password === "password") {
            setIsAuthenticated(true);
        } else {
            alert("Invalid credentials");
        }
    };



    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        !isAuthenticated ? (
                            <Login onLogin={handleLogin} />
                        ) : (
                            <Navigate to="/tasks" replace />
                        )
                    }
                />
                <Route path="/tasks" element={isAuthenticated ? <TaskPage /> : <Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>

    );
};

export default App;