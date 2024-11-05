import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './TaskPage.css';
import { Button, Modal, Box, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
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
const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'due_date', headerName: 'Due Date', width: 150 }
]

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        completed: false,
        due_date: '' // Ensure this matches the backend
    });
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
            toast.success('Tasks fetched successfully');
            setTasks(response.data);
        } catch (error) {
            toast.error('Error fetching tasks');
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
            toast.success('Task created successfully');
        } catch (error) {
            toast.error('Error creating task');
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
                    task.taskId === taskId ? {
                        ...response.data,
                        due_date: response.data.due_date // Keep the date in the response format
                    } : task
                ));
                setEditingTaskId(null);
                toast.success('Task updated successfully');
            }
            fetchTasks();
        } catch (error) {
            toast.error('Error updating task');
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
            setTasks(tasks.filter(task => task.taskId !== taskId));
            fetchTasks();
            toast.success('Task deleted successfully');
        } catch (error) {
            toast.error('Error deleting task');
            console.error('Error deleting task:', error);
        }
    };

    const handleEdit = (task) => {
        setEditingTaskId(task.taskId);
        setEditForm({
            title: task.title,
            description: task.description,
            completed: task.completed,
            due_date: formatDateForInput(task.due_date)
        });
    };
    
    const handleSave = async (taskId) => {
        await updateTask(taskId, editForm);
        setEditingTaskId(null);
    };

    const handleBlur = (taskId) => {
        if (editingTaskId === taskId) {
            handleSave(taskId);
        }
    };

    const handleKeyPress = (e, taskId) => {
        if (e.key === 'Enter') {
            handleSave(taskId);
        }
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

    const rows =[...tasks].map(task => ({
        id: task.taskId,
        title: task.title,
        description: task.description,
        due_date: formatDate(task.due_date)
    }));
    const paginationModel = {page: 0, pageSize: 5};
    return (
        <div className="container">
            <div className="sidebar">
                <Sidebar />
            </div>
            <Toaster richColors position="bottom-right"/>
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
                        <Paper style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{pagination: {paginationModel}}}
                                pageSize={[5, 10]}
                                checkBoxSelection
                                sx={{border:0}}
                            />
                        </Paper>
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
