/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {useState} from "react";
import "./CP-login-page.css"; // Import the CSS file for styling

// Uses the state 
const Login = ({onLogin}) => {

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission
        const username = event.target.username.value;
        const password = event.target.password.value;
        onLogin(username,password)

        // Here, you can integrate with your backend API
        console.log("Username:", username, "Password:", password);
    };

    return (
        <div>
            <div className="top-header">
                <h1>Welcome to Chain-Reaction! The TO-DO list</h1>
                <br />
            </div>
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Username"
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
};

export default Login;