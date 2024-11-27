/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {useState} from "react";
import "./CP-login-page.css"; // Import the CSS file for styling


function Login(props) {
  const [creds, setCreds] = useState({
    username: "",
    pwd: ""
  });

  return (
    <div>
            <div className="top-header">
                <h1>Welcome to Chain-Reaction! The TO-DO list</h1>
                <br />
            </div>
            
             <div className="login-container">
                 <h2>Login</h2>
      <form onSubmit={submitForm}>
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
      <button type="submit">Login</button>
      <h3>- OR -</h3>
      <button type="submit">Create User</button>
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
}
export default Login;
























// Uses the state 
// const Login = ({onLogin}) => {

//     const handleSubmit = (event) => {
//         event.preventDefault(); // Prevent default form submission
//         const username = event.target.username.value;
//         const password = event.target.password.value;
//         onLogin(username,password)

//         // Here, you can integrate with your backend API
//         console.log("Username:", username, "Password:", password);
//     };

    

//     return (
//         <div>
//             <div className="top-header">
//                 <h1>Welcome to Chain-Reaction! The TO-DO list</h1>
//                 <br />
//             </div>
//             <div className="login-container">
//                 <h2>Login</h2>
//                 <form onSubmit={handleSubmit}>
//                     <input
//                         type="text"
//                         id="username"
//                         name="username"
//                         placeholder="Username"
//                         required
//                     />
//                     <input
//                         type="password"
//                         id="password"
//                         name="password"
//                         placeholder="Password"
//                         required
//                     />
//                     <button type="submit">Login</button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Login;