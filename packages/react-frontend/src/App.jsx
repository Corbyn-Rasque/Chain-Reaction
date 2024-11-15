import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Content from './Content';
import Login from "./Login";
import './App.css';

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
        <div className="app">
            {!isAuthenticated ? (
                <Login onLogin={handleLogin} />
            ) : (
                <>
                    <Sidebar />
                    <Content />
                </>
            )}
        </div>
    );
}

export default App;