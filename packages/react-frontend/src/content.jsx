/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
 
import React from 'react';
import './Content.css';

function Content(props) {
     const tasks = props.taskData || []; // Use an empty array if tasks is undefined

    return (
        <div className="content">
            <h1>Today's Tasks</h1>
            {tasks.map((task, index) => (
                <TaskCard
                    key = {index}
                    title="CSC 307"
                    tag = "Test"
                    tasks={[task.name]}
                />
            ))}
            <TaskCard
                key = "1000"
                title="CSC 307 — Intro to Software Engineering"
                tag="Sprint 1"
                tasks={[
                    "Team Assignment 2: UI Prototyping & Storyboard",
                    "Independent Assignment 5: Unit Testing w/ Jest",
                ]}
            />

            <TaskCard
                key = "1001"
                title="CSC 365 — Intro to Databases"
                tag="Group Project - Version 1"
                tasks={[
                    "Group Project : Version 1 Due",
                    "Potion Shop: Version 4 Due (Ledgers)",
                    "Quiz 6: Entity Relations",
                ]}
            />
            <TaskCard
                key = "1002"
                title="CSC 357 - Systems Programming"
                tag="Week 5"
                tasks={[
                    "Group Project : Version 1 Due",
                    "Potion Shop: Version 4 Due (Ledgers)",
                ]}
            />
            
        </div>
    );
}

function TaskCard({ key, title, tag, tasks }) {
    return (
        <div className="task-card">
            <div className="header">
                <h2>{title}</h2>
                <span className="tag">{tag}</span>
            </div>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index}>
                        <input type="checkbox" /> {task}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Content;


