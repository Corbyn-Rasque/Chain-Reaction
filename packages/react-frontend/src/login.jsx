import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const host = import.meta.env.VITE_API_URL;

const Login = (props) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch(`${host}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ email, password }),
        });      
        
        const data = await response.json();

        if (response.status === 401) {
            alert("Login failed: Please check your email and password.");
            return;
        }

        if(data.token) {
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        }
        else { alert('Login failed: No Token Found'); }
    };

    const handleSignup = async (event) =>{
        event.preventDefault();

        const response = await fetch(`${host}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ email, password }),
        });      
        
        const data = await response.json();

        if (response.status === 409) {
            alert("Login failed: Please check your email and password.");
            return;
        }

        if(data.token) {
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        }
        else { alert('SignUp failed!'); }
    };


    return (
        <div>
            <div className = "top-header">
                <h1>Chain Reaction: A To-Do List</h1>
                <br />
            </div>
            <div className = "login-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                    <h3>- OR -</h3>
                    <button type ="button" onClick={handleSignup}>Sign Up</button>
                </form>
            </div>
        </div>
    );

 }

export default Login;