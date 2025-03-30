// components/TaskCard.js
import React from 'react';
import { Card, CardBody, CardText } from 'reactstrap';

const TaskCard = ({ task }) => {
  return (
    <Card className="mb-2 shadow-sm border-0 task-card" style={{ borderLeft: '4px solid #0d6efd' }}>
      <CardBody className="p-3">
        <CardText className="m-0">{task.title}</CardText>
      </CardBody>
    </Card>
  );
};

export default TaskCard;
