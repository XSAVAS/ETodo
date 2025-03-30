// App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Board from './components/Board';

function App() {
  return (
    <div className="app-container">
      <h2 className="text-center fw-bold text-white mb-3"> ToDo Board</h2>
      <Board />
    </div>
  );
}

export default App;
