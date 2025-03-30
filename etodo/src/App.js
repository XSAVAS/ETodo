import React, { useState } from 'react';
import './index.css';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormFeedback
} from 'reactstrap';

function App() {
  const [tasks, setTasks] = useState({
     todo: [
    { id: 1, title: "Task 1" },
    { id: 2, title: "Task 2" },
    { id: 3, title: "Task 3" }
  ],
  inProgress: [
    { id: 4, title: "Task 4" }
  ],
  done: [
    { id: 5, title: "Task 5" }
  ],
  });

  const [activeColumn, setActiveColumn] = useState('');
  const [modalType, setModalType] = useState('add');
  const [modalOpen, setModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editedTaskId, setEditedTaskId] = useState(null);
  const [isInvalid, setIsInvalid] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    setNewTaskTitle('');
    setEditedTaskId(null);
    setIsInvalid(false);
  };

  const openAddModal = (columnKey) => {
    setModalType('add');
    setActiveColumn(columnKey);
    toggleModal();
  };

  const openEditModal = (columnKey, task) => {
    setModalType('edit');
    setActiveColumn(columnKey);
    setEditedTaskId(task.id);
    setNewTaskTitle('');
    toggleModal();
  };

  const handleSave = () => {
    if (newTaskTitle.trim() === '') {
      setIsInvalid(true);
      return;
    }

    if (modalType === 'add') {
      const newTask = {
        id: Date.now(),
        title: newTaskTitle.trim(),
      };
      setTasks(prev => ({
        ...prev,
        [activeColumn]: [...prev[activeColumn], newTask],
      }));
    } else if (modalType === 'edit') {
      setTasks(prev => ({
        ...prev,
        [activeColumn]: prev[activeColumn].map(task =>
          task.id === editedTaskId ? { ...task, title: newTaskTitle.trim() } : task
        ),
      }));
    }

    toggleModal();
  };

  const handleDelete = (columnKey, taskId) => {
    setTasks(prev => ({
      ...prev,
      [columnKey]: prev[columnKey].filter(task => task.id !== taskId),
    }));
  };

  const renderColumn = (key, label, color) => (
    <Col md="4" key={key}>
      <Card className="mb-3 column-card">
        <CardBody>
          <CardTitle tag="h4" className={`text-center fw-bold text-${color}`}>
            {label}
          </CardTitle>
          {tasks[key].map(task => (
            <Card className="mb-2 task-card-custom" key={task.id}>
              <CardBody className="d-flex justify-content-between align-items-center">
                <span>{task.title}</span>
                <div>
                  <Button
                    color="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => openEditModal(key, task)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDelete(key, task.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
          <div className="d-flex justify-content-center mt-3">
            <Button color="primary" size="sm" onClick={() => openAddModal(key)}>
              + Add Task
            </Button>
          </div>
        </CardBody>
      </Card>
    </Col>
  );

  return (
    <div className="app-container">
      <h2 className="text-center fw-bold text-white mb-4">ToDo Board</h2>
      <Container>
        <Row className="justify-content-center gx-4">
          {renderColumn('todo', 'Todo', 'primary')}
          {renderColumn('inProgress', 'In Progress', 'warning')}
          {renderColumn('done', 'Done', 'success')}
        </Row>
      </Container>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {modalType === 'add' ? 'Add New Task' : 'Edit Task'}
        </ModalHeader>
        <ModalBody>
          <Input
            placeholder="Task title..."
            value={newTaskTitle}
            onChange={(e) => {
              setNewTaskTitle(e.target.value);
              setIsInvalid(false);
            }}
            invalid={isInvalid}
          />
          <FormFeedback>Please enter a valid task title.</FormFeedback>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
          <Button color={modalType === 'add' ? 'primary' : 'success'} onClick={handleSave}>
            {modalType === 'add' ? 'Add' : 'Save'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
