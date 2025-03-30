// App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Board from './components/Board';

function App() {
  return (
    <div className="app-container d-flex justify-content-center align-items-center">
      <div className="board-wrapper">
        <h2 className="text-center fw-bold text-primary mb-4"> To Do Board</h2>
        <Board />
      </div>
    </div>
  );
}

export default App;
