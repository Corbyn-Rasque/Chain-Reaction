/* eslint-disable no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import Content from '../content';
import '../App.css';
import addAuthHeader from '../App'





function TaskPage() {
    const[tasks, setTasks] = useState([]);

    address_loc = "http://localhost:8005/tasks";
    address_cloud = "https://chainreaction-dychaqbqbngjdddg.westus3-01.azurewebsites.net/tasks";    

    function fetchTask(){
        const promise = fetch(address_loc,
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