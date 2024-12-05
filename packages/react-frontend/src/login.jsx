import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const host = import.meta.env.VITE_API_URL;

const Login = (props) => {
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        const response = await fetch(`${host}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ email, password }),
        });      
        
        const data = await response.json();

        if(data.token) {
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        }
        else { alert('Login failed'); }
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
                        required
                    />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        required
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );

    // function handleChange(event) {
    //     const { name, value } = event.target;
    //     switch (name) {
    //         case 'username': setCreds({ ...creds, username: value }); break;
    //         case 'password': setCreds({ ...creds, password: value }); break;
    //     }
    // }

    // function submitForm() {
    //     props.handleSubmit(creds);
    //     setCreds({ username: '', password: '' });
    // }

    // function loginUser(creds) {
    //     const response = fetch(`${host}/login`, {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json", },
    //         body: JSON.stringify(creds),
    //     })
    //         .then((res) => {
    //             if (res.status === 200) {
    //                 response.json()
    //                     .then((payload) => setToken(payload.token));
    //                 setMessage('Login successful; auth token saved');
    //             }
    //             else {
    //                 setMessage(`Login Error ${res.status}: ${res.data}`);
    //             }
    //         })
    //         .catch((error) => {
    //             setMessage(`Login Error: ${error}`);
    //         });
        
    //     localStorage.setItem('token', response.json().token);

    //     return response;
    // }
 }

export default Login;