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

// İlk görev örnekleri; her task'a ek alanlar ekledik:
const initialTasks = {
  todo: [
    {
      id: "1",
      title: "Task 1",
      description: "Description 1",
      priority: "1",
      assignee: "Alice",
    },
    {
      id: "2",
      title: "Task 2",
      description: "Description 2",
      priority: "1",
      assignee: "Bob",
    },
    {
      id: "3",
      title: "Task 3",
      description: "Description 3",
      priority: "1",
      assignee: "Charlie",
    },
    {
      id: "4",
      title: "Task 3",
      description: "Description 3",
      priority: "1",
      assignee: "Charlie",
    },
    {
      id: "5",
      title: "Task 3",
      description: "Description 3",
      priority: "3",
      assignee: "Charlie",
    },
    {
      id: "6",
      title: "Task 3",
      description: "Description 3",
      priority: "2",
      assignee: "Charlie",
    },
    {
      id: "7",
      title: "Task 3",
      description: "Description 3",
      priority: "2",
      assignee: "Charlie",
    },
  ],
  inProgress: [
    {
      id: "8",
      title: "Task 4",
      description: "Description 4",
      priority: "2",
      assignee: "David",
    },
  ],
  done: [
    {
      id: "9",
      title: "Task 5",
      description: "Description 5",
      priority: "3",
      assignee: "Eve",
    },
  ],
};

// Yardımcı fonksiyon: öncelik değerine göre renk döner.
const getPriorityColor = (priority) => {
  if (priority === "1") return "red";
  else if (priority === "2") return "#ff7f00 ";
  else if (priority === "3") return "green";
  return "black";
};

function App() {
  // Görevler state'i
  const [tasks, setTasks] = useState(initialTasks);
  // Add/Edit modal state'i
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" veya "edit"
  const [targetColumn, setTargetColumn] = useState("");
  // Task form state'i: başlık, açıklama, öncelik ve atanan kişi
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "1",
    assignee: "",
  });
  const [editTaskId, setEditTaskId] = useState(null);
  const [isInvalid, setIsInvalid] = useState(false);

  // Detay modal state'i (kartın detaylarını görmek için)
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Add/Edit Modal için ayrı açma/kapama fonksiyonları:
  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setTaskForm({ title: "", description: "", priority: "1", assignee: "" });
    setIsInvalid(false);
    setEditTaskId(null);
  };

  // Detay Modal için fonksiyonlar:
  const openDetailModal = () => setDetailModalOpen(true);
  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedTask(null);
  };

  // Drag & Drop işlemi
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

  // Yeni görev eklemek için modalı aç
  const handleAddClick = (columnKey) => {
    setTargetColumn(columnKey);
    setModalMode("add");
    setTaskForm({ title: "", description: "", priority: "1", assignee: "" });
    openModal();
  };

  // Edit işlemi için modalı aç; mevcut bilgileri forma yükle
  const handleEditClick = (columnKey, task) => {
    setTargetColumn(columnKey);
    setModalMode("edit");
    setEditTaskId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignee: task.assignee,
    });
    openModal();
  };

  // Silme işlemi
  const handleDelete = (columnKey, taskId) => {
    setTasks((prev) => ({
      ...prev,
      [columnKey]: prev[columnKey].filter((task) => task.id !== taskId),
    }));
  };

  // Add veya Edit işlemi için kaydet butonu
  const handleSaveTask = () => {
    if (taskForm.title.trim() === "") {
      setIsInvalid(true);
      return;
    }
    if (modalMode === "add") {
      const newItem = {
        id: Date.now().toString(),
        title: taskForm.title.trim(),
        description: taskForm.description.trim(),
        priority: taskForm.priority,
        assignee: taskForm.assignee.trim(),
      };
      setTasks((prev) => ({
        ...prev,
        [targetColumn]: [...prev[targetColumn], newItem],
      }));
    } else if (modalMode === "edit") {
      setTasks((prev) => {
        const updated = {};
        for (const [col, taskList] of Object.entries(prev)) {
          updated[col] = taskList.map((task) =>
            task.id === editTaskId
              ? {
                  ...task,
                  title: taskForm.title.trim(),
                  description: taskForm.description.trim(),
                  priority: taskForm.priority,
                  assignee: taskForm.assignee.trim(),
                }
              : task
          );
        }
        return updated;
      });
    }
    closeModal();
  };

  // Göreve tıklandığında detay modalını aç
  const handleTaskDetail = (task) => {
    setSelectedTask(task);
    openDetailModal();
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
                  {/* Görevlerin listelendiği alan */}
                  <div className="task-list">
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
                            onClick={() => handleTaskDetail(task)}
                            style={{
                              ...provided.draggableProps.style,
                              color: getPriorityColor(task.priority),
                            }}
                          >
                            <span>{task.title}</span>
                            {task.assignee && (
                              <div className="assignee-info">
                                {task.assignee}
                              </div>
                            )}
                            <div
                              className="actions"
                              onClick={(e) => e.stopPropagation()}
                            >
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
                  </div>
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

      {/* Add/Edit Modal */}
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
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({ ...taskForm, title: e.target.value })
              }
              invalid={isInvalid}
            />
            <FormFeedback>Please enter a task title.</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="taskDescription">Description</Label>
            <Input
              id="taskDescription"
              placeholder="Enter description..."
              type="textarea"
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm({ ...taskForm, description: e.target.value })
              }
            />
          </FormGroup>
          <FormGroup>
            <Label for="taskPriority">Priority</Label>
            <Input
              id="taskPriority"
              type="select"
              value={taskForm.priority}
              onChange={(e) =>
                setTaskForm({ ...taskForm, priority: e.target.value })
              }
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="taskAssignee">Assignee</Label>
            <Input
              id="taskAssignee"
              placeholder="Enter assignee..."
              value={taskForm.assignee}
              onChange={(e) =>
                setTaskForm({ ...taskForm, assignee: e.target.value })
              }
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSaveTask}>
            {modalMode === "add" ? "Add" : "Save"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={detailModalOpen} toggle={closeDetailModal}>
        <ModalHeader toggle={closeDetailModal}>Task Details</ModalHeader>
        <ModalBody>
          {selectedTask && (
            <div>
              <p>
                <strong>Title:</strong> {selectedTask.title}
              </p>
              <p>
                <strong>Description:</strong> {selectedTask.description}
              </p>
              <p>
                <strong>Priority:</strong> {selectedTask.priority}
              </p>
              <p>
                <strong>Assignee:</strong> {selectedTask.assignee}
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeDetailModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
