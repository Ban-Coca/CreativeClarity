import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import EnhancedTable from '../components/TablesTask';
import { Priority, PriorityColors, PriorityList } from '../utils/Priority';
import './TaskPage.css';
import { Button, Modal, Box, Typography, Paper, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', width: 150 , editable: true},
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'due_date', headerName: 'Due Date', width: 150 }
]

const TaskPage = () => {

    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openTaskDetails, setOpenTaskDetails] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

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
            setOpen(false);
            fetchTasks();
        }
    }

    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            fontFamily: 'Roboto, sans-serif'
        }}>
            <Box sx={{
                width: '256px',
                bgcolor: 'white',
                boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
            }}>
                <Sidebar />
            </Box>
            <Toaster richColors position="bottom-right" closeButton/>
            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                marginLeft: '1.40rem'
            }}>
                <Box
                    sx={{position: 'fixed',
                        top: 0,
                        right: 0,
                        left: '256px', // Matches sidebar width
                        zIndex: 1100,
                        bgcolor: 'white',}}
                >
                    <Topbar />
                </Box>

                <Box sx={{
                    bgcolor: 'white',
                    height: '100%',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    maxHeight: 'calc(100vh - 64px)',
                    marginTop: '64px',
                    p: '16px'
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography variant="h4">Tasks</Typography>
                        <Box>
                            <Button variant="contained" onClick={handleOpen}>Add Task</Button>
                        </Box>
                    </Box>
                    <Box sx={{ marginTop: '2rem' }}>
                        <EnhancedTable tasks={tasks} onRowClick={handleRowClick}/>
                    </Box>
                </Box>

                <Modal
                    className='modalAddTask'
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="Add Task"
                    aria-describedby="Add a new task"
                    sx={{border:0, borderRadius:"2rem"}}
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h4" component="h2">
                            Add Task
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 , display:"flex", flexDirection:"column"}}>
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
                        </Typography>
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
            </Box>
        </Box>
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
            <Box sx={{
                ...style,
                width: 800,
                height: 500,
                border: 'none',
                borderRadius: '0.75rem',
                p: 2    
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'left',
                    borderBottom: '1px solid #ccc',
                }}>
                    <Typography variant="h6" gutterBottom>
                        Task Details
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                    }}>
                        <IconButton onClick={onclick}>
                            <EditIcon/>
                        </IconButton>

                        <IconButton onClick={() => onDelete(task.taskId)}>
                            <DeleteIcon sx={{color:'red'}}/>
                        </IconButton>
                    </Box>
                </Box>
                
                <Box sx={{display:"flex", flexDirection:'column'}}>
                    <Box sx={{marginTop: '2rem', marginLeft: '6rem'}}>
                        <Typography variant="h4" gutterBottom sx={{marginBottom: '2rem'}}>
                            {task.title}
                        </Typography>
                    </Box>

                    <Box sx={{display: 'flex', justifyContent:'space-between', marginLeft: '6rem', marginRight:'14rem'}}>
                        <Box>
                            <Typography variant="body1" gutterBottom>
                                    <strong>Status:</strong> {task.completed ? 'Completed' : 'Ongoing'}
                                </Typography>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Priority:</strong>
                                </Typography>
                                <Box sx={{marginLeft: '1rem', backgroundColor: PriorityColors[task.priority], color: 'white', padding: '0.5rem', borderRadius: '0.25rem'}}>
                                    {task.priority}
                                </Box>
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="body1" gutterBottom>
                                <strong>Due Date:</strong> {formatDate(task.due_date)}
                            </Typography>
                        </Box>
                    </Box>
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
                    
                </Box>

                
                
            </Box>
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
            <Box sx={{
                ...style,
                borderRadius: '0.75rem',
            }}>
                <Box>
                    <Typography id="modal-modal-title" variant="h5" component="h2" sx={{color: 'red'}}>
                        Delete Task
                    </Typography>
                </Box>
                
                <Box>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Are you sure you want to delete task "<strong>{taskTitle}</strong>"?
                    </Typography>
                </Box>
                
                <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 4}}>
                    <Button variant="contained" onClick={onClose}>Cancel</Button>
                    <Button variant="contained" color='error' onClick={onConfirm}>Delete</Button>
                </Box>
                
            </Box>
        </Modal>
    );
}

export default TaskPage;
