import React, { useEffect, useState } from 'react';
// import App from './App'
import './content.css';

function Content(props) {
    var domains = props.domainData[0] || [];

    if(!domains) {
        return (
            <div className="content">
                <h1>Today's Tasks</h1>
            </div>
        );
    }

    return (
        <div className="content">
            <h1>Today's Tasks</h1>
            {domains.map((domain) => (
                <TaskCard
                    key = {domain.id}
                    title = {domain.name}
                    tag = {new Date(domain.end)
                            .toLocaleDateString("en-US", 
                                { weekday: 'long', month: 'long', day: 'numeric' }
                            )
                          }
                    initialTasks = {domain.tasks || []}
                    domain = {domain.id}
                    props = {props}
                />
            ))}
        </div>
    );
}


function TaskCard({ title, tag, initialTasks, domain, props}) {
    const [tasks, setTasks] = useState(initialTasks);

    var handleCheckBoxChange;
    try {
        handleCheckBoxChange = async (task_id, task) => {
            const task_updated = await props.update_task(task_id, { ...task, completed: !task.completed });
    
            if (task_updated) {
                const refreshed_tasks = await props.fetch_tasks_by_domain(domain);
                    setTasks(refreshed_tasks);
            }
        }
    }
    catch (error) { console.error("Error updating task:", error); }

    return (
        <div className="task-card">
            <div className="header">
                <h2>{title}</h2>
                <span className="tag">{tag}</span>
            </div>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <input
                            type = "checkbox"
                            checked = {task.completed}
                            onChange = { () => handleCheckBoxChange(task.id, task) }
                        /> {" "}
                        {task.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Content;