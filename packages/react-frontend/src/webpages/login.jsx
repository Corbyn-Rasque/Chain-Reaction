/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./CP-login-page.css"; // Import the CSS file for styling

function Login(props) {
    const [creds, setCreds] = useState({
        username: "",
        pwd: "",
    });

    return (
        <div>
            <div className="top-header">
                <h1>Welcome to Chain-Reaction! The TO-DO list</h1>
                <br />
            </div>

            <div className="login-container">
                <h2>Login</h2>
                <form>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Email"
                        value={creds.username}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        value={creds.pwd}
                        onChange={handleChange}
                    />
                    <input
                      type = "button"
                      value = "Log in"
                      onClick={submitForm} />
                    <h3>- OR -</h3>
                    <input
                      type = "button"
                      value = "Create User"
                      onClick={handleSignUp} />
                </form>
            </div>
        </div>
    );

    function handleChange(event) {
        const { name, value } = event.target;
        switch (name) {
            case "username":
                setCreds({ ...creds, username: value });
                break;
            case "password":
                setCreds({ ...creds, pwd: value });
                break;
        }
    }

    function submitForm() {
        props.handleSubmit(creds);
        setCreds({ username: "", pwd: "" });
    }

    function handleSignUp() {
        props.handleSubmit(creds);
        setCreds({ username:"", pwd: ""})
    }
}


export default Login;
