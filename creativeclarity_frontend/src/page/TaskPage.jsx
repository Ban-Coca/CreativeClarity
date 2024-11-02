import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './TaskPage.css';
import { Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// Set the base URL for Axios
axios.defaults.baseURL = 'http://localhost:8080';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        completed: false,
        due_date: '' // Ensure this matches the backend
    })
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        completed: false,
        due_date: '' // Ensure this matches the backend field name
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const API_URL = '/api/task/getalltask';
            const response = await axios.get(API_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const createTask = async (task) => {
        try {
            const response = await axios.post('/api/task/posttaskrecord', task, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
            setTasks([...tasks, response.data]);
            setNewTask({
                title: '',
                description: '',
                completed: false,
                due_date: '' // Ensure this matches the backend field name
            });
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const updateTask = async (taskId, updatedTask) => {
        console.log('Updating task:', taskId, updatedTask);
        try {
            // Format the date properly for the backend
            const formattedTask = {
                ...updatedTask,
                due_date: new Date(updatedTask.due_date).toISOString().split('T')[0]
            };

            const response = await axios.put(`/api/task/puttaskdetails?taskId=${taskId}`, formattedTask, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data) {
                setTasks(tasks.map(task => 
                    task.id === taskId ? {
                        ...response.data,
                        due_date: response.data.due_date // Keep the date in the response format
                    } : task
                ));
                setEditingTask(null);
            }
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error.response?.data || error.message);
        }
    };
    
    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`/api/task/deletetaskdetails/${taskId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
            setTasks(tasks.filter(task => task.id !== taskId));
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task.id);
        setEditForm({
            title: task.title,
            description: task.description,
            completed: task.completed,
            due_date: formatDateForInput(task.due_date)
        });
    };
    
    // Add this function to handle save
    const handleSave = async (taskId) => {
        await updateTask(taskId, editForm);
        setEditingTask(null);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    console.log(tasks);
    const formatDate = (date) => {
        const dateObj = new Date(date);
        return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    }
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };
    return (
        <div className="container">
            <div className="sidebar">
                <Sidebar />
            </div>
            
            <div className="main-content">
                <div className="topbar">
                    <Topbar />
                </div>

                <div className="task-section">
                    <div className="task-header">
                        <h1>Tasks</h1>
                        <div className="addTaskButton">
                            <Button variant="contained" onClick={handleOpen}>Add Task</Button>
                        </div>
                    </div>
                    <div className="task-list">
                    {tasks.map(task => (
                        <div key={task.id} className="task">
                            {editingTask === task.id ? (
                                // Edit form
                                <div>
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                    />
                                    <input
                                        type="text"
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                    />
                                    <input
                                        type="date"
                                        value={editForm.due_date}
                                        onChange={(e) => setEditForm({...editForm, due_date: e.target.value})}
                                    />
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => handleSave(task.taskId)}
                                    >
                                        Save
                                    </Button>
                                    <Button 
                                        variant="contained"
                                        onClick={() => setEditingTask(null)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                // Normal display
                                <>
                                    <h3>{task.title}</h3>
                                    <p>{task.description}</p>
                                    <p>Due: {formatDate(task.due_date)}</p>
                                    <div className="task-buttons">
                                        <Button 
                                            variant="contained" 
                                            color="primary"
                                            onClick={() => handleEdit(task)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="contained" 
                                            sx={{backgroundColor:"red"}} 
                                            onClick={() => deleteTask(task.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    </div>
                </div>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="Add Task"
                    aria-describedby="Add a new task"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Add Task
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 , display:"flex", flexDirection:"column"}}>
                            <input
                                type="text"
                                placeholder="Task Title"
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Task Description"
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            />
                            <input
                                type="date"
                                placeholder="Due Date"
                                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })} // Ensure this matches the backend field name
                            />
                            <Button
                                variant="contained"
                                onClick={() => {
                                    createTask(newTask);
                                    handleClose();
                                }}
                            >
                                Add Task
                            </Button>
                        </Typography>
                    </Box>
                </Modal>
            </div>
        </div>
    );
};

export default TaskPage;
