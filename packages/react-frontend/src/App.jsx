/* eslint-disable no-unused-vars */
 
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';
import Login from "./webpages/login";
import TaskPage from './webpages/taskPage';
import { loginUser } from '../../express-backend/auth';

// Default first page loaded is login
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const INVALID_TOKEN = "INVALID_TOKEN";
    const [token, setToken] = useState(INVALID_TOKEN);
    const [message, setMessage] = useState("");

    const handleLogin = (email, password) => {
        // Simulate login process (replace with real authentication logic)
        if (email === "admin" && password === "password") {
            setIsAuthenticated(true);
        } else {
            alert("Invalid credentials");
        }
    };

    function loginUser(creds) {
        const promise = fetch(`http://localhost:8005/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(creds)
        })
          .then((response) => {
            if (response.status === 200) {
              response
                .json()
                .then((payload) => setToken(payload.token));
              setMessage(`Login successful; auth token saved`);
            } else {
              setMessage(
                `Login Error ${response.status}: ${response.data}`
              );
            }
          })
          .catch((error) => {
            setMessage(`Login Error: ${error}`);
          });
      
        return promise;
      }

    function signupUser(creds) {
        const promise = fetch(`http://localhost:8005/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(creds)
        })
          .then((response) => {
            if (response.status === 201) {
              response
                .json()
                .then((payload) => setToken(payload.token));
              setMessage(
                `Signup successful for user: ${creds.username}; auth token saved`
              );
            } else {
              setMessage(
                `Signup Error ${response.status}: ${response.data}`
              );
            }
          })
          .catch((error) => {
            setMessage(`Signup Error: ${error}`);
          });
      
        return promise;
    }
    function addAuthHeader(otherHeaders = {}) {
        if (token === INVALID_TOKEN) {
          return otherHeaders;
        } else {
          return {
            ...otherHeaders,
            Authorization: `Bearer ${token}`
          };
        }
      }



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