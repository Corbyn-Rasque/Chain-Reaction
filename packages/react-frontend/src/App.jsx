import React from 'react';
import Sidebar from './Sidebar';
import Content from './Content';
import './App.css';

function App() {
    return (
        <div className="app">
            <Sidebar />
            <Content />
        </div>
    );
}

export default App;