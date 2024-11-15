/* eslint-disable no-unused-vars */
 
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Content from './content';
// import Login from "./Login";
import './App.css';

function App() {
    // const [isAuthenticated, setIsAuthenticated] = useState(false);

    // const handleLogin = (username, password) => {
    //     // Simulate login process (replace with real authentication logic)
    //     if (username === "admin" && password === "password") {
    //         setIsAuthenticated(true);
    //     } else {
    //         alert("Invalid credentials");
    //     }
    // };

    // return (
    //     <div className="app">
    //         {!isAuthenticated ? (
    //             <Login onLogin={handleLogin} />
    //         ) : (
    //             <>
    //                 <Sidebar />
    //                 <Content />
    //             </>
    //         )}
    //     </div>
    // );
    const[tasks, setTasks] = useState([]);

    function fetchTask(){
        const promise = fetch("http://localhost:8004/tasks")
        return promise
    }


    // fetch tasks from backend and load into state
    useEffect(() => {
        fetchTask()
            .then((res)=> res.json())
            .then((json) => setTasks(json))
            .catch((error) => {console.log(error);});
    },[]);

    
    
    // Returns to display
    return (
        <div className="app">
            <Sidebar />
            <Content 
                taskData = {tasks}
            />
        </div>
    );
};

export default App;