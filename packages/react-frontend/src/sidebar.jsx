import React from 'react';
import { useNavigate } from 'react-router-dom';
import './sidebar.css';

const host = import.meta.env.VITE_API_URL;

function Sidebar() {
    const navigate = useNavigate()

    const handleSignout = async (event) => {
        event.preventDefault()
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <div className="sidebar">
            <h2>Chain Reaction</h2>
            <a href="#">Inbox</a>
            <a href="#" className="active">School</a>
            <a href="#">Projects</a>
            <button type="button" onClick={handleSignout}>Sign Out</button>
        </div>
    );
}

export default Sidebar;
