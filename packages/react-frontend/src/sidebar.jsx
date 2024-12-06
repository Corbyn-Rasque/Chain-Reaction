import React from 'react';
import './sidebar.css';

function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Chain Reaction</h2>
            <a href="#">Inbox</a>
            <a href="#" className="active">School</a>
            <a href="#">Projects</a>
        </div>
    );
}

export default Sidebar;
