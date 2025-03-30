// components/Board.js
import React, { useState } from 'react';
import Table from './Table';
import AddTable from './AddTable';

const Board = () => {
  const [tables, setTables] = useState([
    { title: 'To Do', tasks: [{ title: 'Research project' }, { title: 'Team meeting notes' }] },
    { title: 'In Process', tasks: [{ title: 'Develop login page' }] },
    { title: 'Completed', tasks: [{ title: 'Design wireframes' }] },
  ]);

  const handleAddTable = () => {
    const newTitle = prompt('Yeni tablo adı:');
    if (newTitle) {
      setTables([...tables, { title: newTitle, tasks: [] }]);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        overflowX: 'auto',
        width: '100%',
        padding: '10px 0',
      }}
    >
      {tables.map((table, index) => (
        <Table key={index} title={table.title} tasks={table.tasks} />
      ))}
      <AddTable onClick={handleAddTable} />
    </div>
  );
};

export default Board;
