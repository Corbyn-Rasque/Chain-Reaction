import React from 'react';
import './content.css';

function Content(props) {
    const domains = props.domainData || [];

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
                    tasks = {domain.tasks || []}
                />
            ))}
        </div>
    );
}

function TaskCard({ title, tag, tasks }) {
    return (
        <div className="task-card">
            <div className="header">
                <h2>{title}</h2>
                <span className="tag">{tag}</span>
            </div>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <input type="checkbox" /> {task.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Content;