import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar.jsx';
import Content from './content.jsx';
import './app.css';

// Uses a localhost address in IDE, and the live URL otherwise
// .env -> localhost, .env.production -> live URL
const host = import.meta.env.VITE_API_URL;


function App() {
    const INVALID_TOKEN = 'INVALID_TOKEN';
    const [token, setToken] = useState(INVALID_TOKEN);
    const [domains, setDomains] = useState([]);
    const navigate = useNavigate();

    function addAuthHeader(otherHeaders = {}) {
        if (token === 'INVALID_TOKEN') { return otherHeaders; }
        else { return { ...otherHeaders, Authorization: `Bearer ${token}` }; }
    }

    async function fetch_tasks_by_domain(domain_id) {
        const response = await fetch(`${host}/domains/${domain_id}/tasks`, {
            headers: addAuthHeader(),
        });

        if (response.status == 200) { return response.json(); }
        else { throw new Error("Fetching subdomains & tasks failed!"); }
    }

    async function update_task (task_id, updated_task, group = null, order= null) {
        if (!group) { group = updated_task.group; }
        if (!order) { order = updated_task.order; }

        const response = await fetch(`${host}/tasks/${task_id}?group=${group}&order=${order}`, {
            method: "PUT",
            headers: addAuthHeader({ "Content-Type": "application/json", }),
            body: JSON.stringify(updated_task), });
        
        if (response.status == 204) { return true; }
        else { throw new Error("Updating task failed!"); }                
    }

    async function remove_task(task_id) {
        const response = await fetch(`${host}/tasks/${task_id}`, {
            method: "DELETE",
            headers: addAuthHeader(),
        })

        if (response.status == 204) { return true; }
        else { throw new Error("Removing task failed!"); }
    }

    async function get_all_data() {

        console.log("TOKEN::: ", token);

        const results = await fetch(`${host}/dashboard/all`, {
            headers: addAuthHeader(),
        });

        return results;
    }

    useEffect(() => {
        const stored_token = localStorage.getItem('token');
        if (stored_token && stored_token != INVALID_TOKEN) {
            setToken(stored_token);
        }
        else {
            navigate("/login");
        }
    })

    useEffect(() => {
        if(token === INVALID_TOKEN) { return; }

        get_all_data()
            .then((result) => {
                result.json().then((payload) => setDomains(payload));
            })
            .catch((error) => console.log(error));

    }, [token]);

    return (
        <div className="app">
            <Sidebar />
            <Content 
                domainData = {domains}
                fetch_tasks_by_domain = {fetch_tasks_by_domain}
                update_task = {update_task}
                remove_task = {remove_task}
            />
        </div>
    );
};

export default App;
