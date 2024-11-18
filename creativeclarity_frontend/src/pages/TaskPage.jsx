import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import EnhancedTable from '../components/TablesTask';
import { Priority, PriorityColors, PriorityList } from '../utils/Priority';
import { Button, Modal, Box, Typography, Paper, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';
import { fetchTasks, createTask, updateTask, deleteTask } from '../service/taskService';
// Set the base URL for Axios
axios.defaults.baseURL = 'http://localhost:8080';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const TaskPage = ({onLogout}) => {

    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openTaskDetails, setOpenTaskDetails] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [loading, setLoading] = useState(false);

    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        completed: false,
        due_date: '',
        priority: ''
    });
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        completed: false,
        due_date: '',
        priority: ''
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
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
        } finally {
            setLoading(false);
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
                due_date: '', // Ensure this matches the backend field name
                priority: ''
            });
            toast.success('Task created successfully');
            fetchTasks();
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

    const handleEdit = (task) => {
        setEditingTaskId(task.taskId);
        setEditForm({
            title: task.title,
            description: task.description,
            completed: task.completed,
            due_date: formatDateForInput(task.due_date),
            priority: task.priority
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
    
    const handleRowClick = (task) => {
        setSelectedTask(task);
        setOpenTaskDetails(true);
    };

    const handleDelete = async (taskId) => {
        setTaskToDelete(taskId);
        setOpenDeleteModal(true);
    };

    const confirmDelete = async () => {
        if(taskToDelete) {
            await deleteTask(taskToDelete);
            setTasks(tasks.filter(task => task.taskId !== taskToDelete));
            setOpenDeleteModal(false);
            setTaskToDelete(null);
            setOpenTaskDetails(false);
            fetchTasks();
        }
    }

    return (
        <div className="flex min-h-screen">
            <div className="w-64 bg-white shadow-md">
                <Sidebar onLogout={onLogout}/>
            </div>
            <Toaster richColors position="bottom-right" closeButton/>
            <div className="flex-1 flex flex-col">
                <div className="bg-[#f9fafb] h-full shadow-sm max-h-full p-4 w-100">
                    <div className="flex justify-between items-center mt-4 ml-4">
                        {tasks.length === 0 ? <h1 className="text-2xl font-bold text-gray-900">Ready to start tracking tasks?</h1> : <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>}
                        <div>
                            <Button variant="contained" onClick={handleOpen}>Add Task</Button>
                        </div>
                    </div>
                    <div className="mt-8">
                        <EnhancedTable tasks={tasks} onRowClick={handleRowClick} loading={loading} open={handleOpen}/>
                    </div>
                </div>

                <Modal
                    className='modalAddTask'
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="Add Task"
                    aria-describedby="Add a new task"
                    sx={{border:0, borderRadius:"2rem"}}
                >
                    <Box sx={style}>
                        <h2 className="text-2xl font-semibold">Add Task</h2>
                        <div className="mt-2 flex flex-col">
                            <TextField
                                label="Title"
                                variant="outlined"
                                value={newTask.title}
                                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                required/>

                            <TextField
                                label="Description"
                                variant="outlined"
                                value={newTask.description}
                                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                margin='normal'
                                fullWidth
                                required/>

                            <FormControl fullWidth margin="normal">
                                <InputLabel id="priority-select-label">Priority</InputLabel>
                                <Select
                                    labelId="priority-select-label"
                                    id="priority-select"
                                    label="Priority"
                                    value={newTask.priority} 
                                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                                    {PriorityList.map((priority) => (
                                        <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                name="endDate"
                                label="End Date"
                                type="date"
                                value={newTask.due_date}
                                onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                margin="normal"
                                required
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
                        </div>
                    </Box>
                </Modal>
                <TaskDetailsModal 
                    task={selectedTask} 
                    onClose={() => setOpenTaskDetails(false)} 
                    open={openTaskDetails} 
                    onDelete={handleDelete}/>
                <ModalDelete 
                    open={openDeleteModal}
                    onClose={() => setOpenDeleteModal(false)}
                    onConfirm={confirmDelete}
                    taskTitle={tasks.find(task => task.taskId === taskToDelete)?.title || ''}
                />
            </div>
        </div>
    );
};

const TaskDetailsModal = ({ task, onClose, open, onDelete }) => {
    const formatDate = (date) => {
        const dateObj = new Date(date);
        return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    }
    console.log(task)
    if (!task) return null;
    console.log("This is opened!");
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="task-details-modal"
            aria-describedby="task-details-description"
        >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-white rounded-xl p-2">
                <div className="flex justify-between items-left border-b border-gray-300">
                    <h2 className="text-xl font-semibold mb-2">Task Details</h2>
                    <div className="flex">
                        <IconButton onClick={onclick}>
                            <EditIcon/>
                        </IconButton>

                        <IconButton onClick={() => onDelete(task.taskId)}>
                            <DeleteIcon className="text-red-500"/>
                        </IconButton>
                    </div>
                </div>
                
                <div className="flex flex-col">
                    <div className="mt-8 ml-24">
                        <h1 className="text-2xl font-semibold mb-8">{task.title}</h1>
                    </div>

                    <div className="flex justify-between ml-24 mr-56">
                        <div>
                            <p className="mb-2">
                                <strong>Status:</strong> {task.completed ? 'Completed' : 'Ongoing'}
                            </p>
                            <div className="flex items-center mt-5">
                                <p className="mb-2">
                                    <strong>Priority:</strong>
                                </p>
                                <div className="ml-4" style={{backgroundColor: PriorityColors[task.priority], color: 'white', padding: '0.5rem', borderRadius: '0.25rem'}}>
                                    {task.priority}
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="mb-2">
                                <strong>Due Date:</strong> {formatDate(task.due_date)}
                            </p>
                        </div>
                    </div>
                    <Box sx={{margin: '1rem 10rem 0 6rem'}}>
                        <TextField
                            fullWidth
                            multiline
                            variant='outlined'
                            label='Description'
                            value={task.description}
                            slotProps={{readOnly: true}}
                            />

                    </Box>
                    
                </div>
            </div>
        </Modal>
    );
};

const ModalDelete = ({open, onClose, onConfirm, taskTitle}) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white p-4 rounded-xl">
                <div>
                    <h2 className="text-xl font-semibold text-red-500">Delete Task</h2>
                </div>
                
                <div>
                    <p className="mt-2">
                        Are you sure you want to delete task "<strong>{taskTitle}</strong>"?
                    </p>
                </div>
                
                <div className="flex justify-between mt-4">
                    <Button variant="contained" onClick={onClose}>Cancel</Button>
                    <Button variant="contained" color='error' onClick={onConfirm}>Delete</Button>
                </div>
                
            </div>
        </Modal>
    );
}
TaskPage.propTypes = {
    onLogout: PropTypes.func.isRequired
  };
export default TaskPage;
