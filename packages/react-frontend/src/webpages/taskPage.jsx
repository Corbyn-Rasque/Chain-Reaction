/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import Content from '../content';
import '../App.css';
import addAuthHeader from '../App'


function TaskPage() {
    const[tasks, setTasks] = useState([]);

    function fetchTask(){
        const promise = fetch("https://chainreaction-dychaqbqbngjdddg.westus3-01.azurewebsites.net/tasks",
        {
            headers: addAuthHeader()
        });
        return promise
    }
    


    // fetch tasks from backend and load into state
    useEffect(() => {
        fetchTask()
            .then((res) =>
                res.status === 200 ? res.json() : undefined
            )
            .then((json) => {
                if (json) {
                  setTasks(json);
                } else {
                  setTasks(null);
                }
            })
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

export default TaskPage;