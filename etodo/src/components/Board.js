// components/Board.js
import React, { useState } from 'react';
import Table from './Table';
import AddTable from './AddTable';
import { Row } from 'reactstrap';

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
    <div className="px-4 pb-5" style={{ overflowX: 'auto' }}>
      <Row className="flex-nowrap" style={{ whiteSpace: 'nowrap' }}>
        {tables.map((table, index) => (
          <Table key={index} title={table.title} tasks={table.tasks} />
        ))}
        <AddTable onClick={handleAddTable} />
      </Row>
    </div>
  );
};

export default Board;
