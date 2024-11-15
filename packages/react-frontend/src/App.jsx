/* eslint-disable no-unused-vars */
import React, {useState,useEffect} from 'react';
import Sidebar from './Sidebar';
import Content from './content';
import './App.css';

function App() {

    
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
}

export default App;