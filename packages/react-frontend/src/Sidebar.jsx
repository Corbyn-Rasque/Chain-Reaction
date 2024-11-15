// eslint-disable-next-line no-unused-vars
import React from 'react';
import './Sidebar.css';

function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Chain Reaction</h2>
            <a href="#" className="active">Inbox</a>
            <a href="#">School</a>
            <a href="#">Projects</a>
        </div>
    );
}

export default Sidebar;