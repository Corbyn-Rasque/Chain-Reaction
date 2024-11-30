import React, { useEffect, useState } from 'react';
import Sidebar from './sidebar';
import Content from './content';
import Login from "./webpages/login";
// import jwt from "jsonwebtoken";
import './app.css';

// Uses a localhost address in IDE, and the live URL otherwise
// .env -> localhost, .env.production -> live URL
const host = import.meta.env.VITE_API_URL;

async function fetch_subdomains_and_tasks(user_domain) {
    const response = await fetch(`${host}/domains/${user_domain}`);
    
    if (response.status == 200) { return response.json(); }
    else { throw new Error("Fetching subdomains & tasks failed!"); }
}

async function fetch_tasks_by_domain(domain_id) {
    const response = await fetch(`${host}/domains/${domain_id}/tasks`);

    if (response.status == 200) { return response.json(); }
    else { throw new Error("Fetching subdomains & tasks failed!"); }
}

async function update_task (task_id, updated_task) {
    const response = await fetch(`${host}/tasks/${task_id}`,
                                { method: "PUT",
                                  headers: { "Content-Type": "application/json", },
                                  body: JSON.stringify(updated_task), });
    
    if (response.status == 204) { return true; }
    else { throw new Error("Updating task failed!"); }                
}

function App() {
    const[domains, setDomains] = useState([]);

    useEffect(() => {
        fetch_subdomains_and_tasks(1)
            .then((results) => { setDomains(results); })
            .catch((error) => { console.error(error);});
    },[]);

    return (
        <div className="app">
            <Sidebar />
            <Content 
                domainData = {domains}
                fetch_tasks_by_domain = {fetch_tasks_by_domain}
                update_task = {update_task}
            />
        </div>
    );
};

export default App;