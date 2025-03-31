import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
  FormFeedback,
} from "reactstrap";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./index.css";

const initialTasks = {
  todo: [
    { id: "1", title: "Task 1" },
    { id: "2", title: "Task 2" },
    { id: "3", title: "Task 3" },
  ],
  inProgress: [{ id: "4", title: "Task 4" }],
  done: [{ id: "5", title: "Task 5" }],
};

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [targetColumn, setTargetColumn] = useState("");
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [isInvalid, setIsInvalid] = useState(false);

  // Modal açma ve kapama işlemlerini ayrı yönetin.
  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setNewTask("");
    setIsInvalid(false);
    setEditTaskId(null);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceItems = Array.from(tasks[source.droppableId]);
    const destItems = Array.from(tasks[destination.droppableId]);
    const [moved] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, moved);
      setTasks((prev) => ({ ...prev, [source.droppableId]: sourceItems }));
    } else {
      destItems.splice(destination.index, 0, moved);
      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems,
      }));
    }
  };

  const handleAddClick = (columnKey) => {
    setTargetColumn(columnKey);
    setModalMode("add");
    openModal();
  };

  const handleEditClick = (columnKey, task) => {
    setTargetColumn(columnKey);
    setModalMode("edit");
    setEditTaskId(task.id);
    setNewTask(task.title);
    openModal();
  };

  const handleDelete = (columnKey, taskId) => {
    setTasks((prev) => ({
      ...prev,
      [columnKey]: prev[columnKey].filter((task) => task.id !== taskId),
    }));
  };

  const handleSaveTask = () => {
    if (newTask.trim() === "") {
      setIsInvalid(true);
      return;
    }

    if (modalMode === "add") {
      const newItem = {
        id: Date.now().toString(),
        title: newTask.trim(),
      };
      setTasks((prev) => ({
        ...prev,
        [targetColumn]: [...prev[targetColumn], newItem],
      }));
    } else if (modalMode === "edit") {
      // Tüm kolonları gezerek ilgili görevi güncelliyoruz.
      setTasks((prev) => {
        const updated = {};
        for (const [col, taskList] of Object.entries(prev)) {
          updated[col] = taskList.map((task) =>
            task.id === editTaskId ? { ...task, title: newTask.trim() } : task
          );
        }
        return updated;
      });
    }

    closeModal();
  };

  const columns = [
    { key: "todo", title: "Todo", color: "primary" },
    { key: "inProgress", title: "In Progress", color: "warning" },
    { key: "done", title: "Done", color: "success" },
  ];

  return (
    <div className="app-container">
      <h2 className="board-title">ToDo Board</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {columns.map(({ key, title, color }) => (
            <Droppable droppableId={key} key={key}>
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h5 className={`text-${color} text-center fw-bold mb-3`}>
                    {title}
                  </h5>
                  {tasks[key].map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="task-card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span>{task.title}</span>
                          <div className="actions">
                            <Button
                              color="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditClick(key, task)}
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
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <div className="text-center mt-2">
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => handleAddClick(key)}
                    >
                      + Add Task
                    </Button>
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <Modal isOpen={modalOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal}>
          {modalMode === "add" ? "Add New Task" : "Edit Task"}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="taskTitle">Task Title</Label>
            <Input
              id="taskTitle"
              placeholder="Enter task..."
              value={newTask}
              onChange={(e) => {
                setNewTask(e.target.value);
                setIsInvalid(false);
              }}
              invalid={isInvalid}
            />
            <FormFeedback>Please enter a task title.</FormFeedback>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSaveTask}>
            {modalMode === "add" ? "Add Task" : "Save"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
