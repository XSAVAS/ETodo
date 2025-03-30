// components/Table.js
import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import TaskCard from './TaskCard';

const Table = ({ title, tasks }) => {
  return (
    <Card
      className="me-3 table-column shadow-lg rounded-3"
      style={{ minWidth: '320px', maxWidth: '320px', height: '500px' }}
    >
      <CardHeader
        className="bg-gradient text-white fw-bold"
        style={{ backgroundColor: '#0d6efd', padding: '0.75rem 1rem' }}
      >
        {title}
      </CardHeader>
      <CardBody
        className="overflow-auto"
        style={{
          height: 'calc(100% - 56px)', // header yüksekliği çıkarıldı
          backgroundColor: 'white', // gri arka plan kaldırıldı
          padding: '0.75rem',
        }}
      >
        {tasks.map((task, index) => (
          <TaskCard key={index} task={task} />
        ))}
      </CardBody>
    </Card>
  );
};

export default Table;
