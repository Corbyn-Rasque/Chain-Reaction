import React, { useEffect, useState } from 'react';
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
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    var togglePopover;
    togglePopover = () => {
        setIsPopoverOpen(!isPopoverOpen);
        console.log("HELLO", isPopoverOpen);
    };

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

    var changeOrder;
    try {
        changeOrder = async (task_id, task, change) => {
            const task_updated = await props.update_task(task_id, task, task.group, task.order+change);

            console.log('here');

            if (task_updated) {
                const refreshed_tasks = await props.fetch_tasks_by_domain(domain);
                setTasks(refreshed_tasks);
            }
        }
    }
    catch (error) { console.error("Error changing task order:", error); }

    var removeTask;
    try {
        removeTask = async (task_id) => {
            const removed = await props.remove_task(task_id);

            if (removed) {
                const refreshed_tasks = await props.fetch_tasks_by_domain(domain);
                setTasks(refreshed_tasks);
            }
        }
    }
    catch (error) { console.error("Error removing task:", error); }

    return (
        <div className="task-card">
            <div className="header">
                <h2>{title}</h2>
                <span className="tag">{tag}</span>
            </div>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id} className='task-item'>
                        <input
                            type = "checkbox"
                            checked = {task.completed}
                            onChange = { () => handleCheckBoxChange(task.id, task) }
                        /> {" "}
                        <div className='task-content'>
                            <span>{task.name}</span>
                            {task.order !== 1 && ( <button className = "button" onClick={ () => changeOrder(task.id, task, -1) }>↑</button> )}
                            {task.order != Math.max(...tasks.filter((any_task) => any_task.group == task.group).map((group_task) => group_task.order)) && (<button className = "button" onClick={ () => changeOrder(task.id, task, 1) }>↓</button>)}
                            <button className = "button" onClick={ () => removeTask(task.id) }>remove</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Content;