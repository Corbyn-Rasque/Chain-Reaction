import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Content from './content';
import Login from "./webpages/login";
// import jwt from "jsonwebtoken";
import './App.css';

// Uses a localhost address in IDE, and the live URL otherwise
// .env -> localhost, .env.production -> live URL
const host = import.meta.env.VITE_API_URL;

function App() {
    const[domains, setDomains] = useState([]);

    function fetchSubDomains(domain_id) {
        const promise = fetch(`${host}/domains/${domain_id}/subdomains`);
        return promise;
    }

    function fetchTasks(domain_id) {
        const promise = fetch(`${host}/domains/${domain_id}/tasks`)
        return promise;
    }
    
    async function getTasks(domain) {
        try {
            const response = await fetchTasks(domain.id);
            const tasks = await response.json();
            return tasks;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }

    useEffect(() => {
        fetchSubDomains(1)
            .then((results) => { return results.json(); })
            .then(async (json) => {
                    const updatedDomains = await Promise.all(json.map(async (domain) => {
                        const domainTasks = await getTasks(domain);
                        return { ...domain, tasks: domainTasks };
                    }));
                console.log(updatedDomains);
                setDomains(updatedDomains);
            })
            .catch((error) => { console.error(error);});
    },[]);

    
    
    // Returns to display
    return (
        <div className="app">
            <Sidebar />
            <Content 
                domainData = {domains}
                taskData = {tasks}
            />
        </div>
    );
};

export default App;