import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import EnhancedTable from '../components/TablesTask';
import { Priority, PriorityColors, PriorityList } from '../utils/Priority';
import { Button, Modal, Box, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';
import { fetchTasks, createTask, updateTask, deleteTask } from '../service/taskService';
import { Save, X, Edit, Trash2} from 'lucide-react';
import { lineWobble } from 'ldrs';
// Set the base URL for Axios
axios.defaults.baseURL = 'http://localhost:8080';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '0.75rem'
};
function LoadingComponent({loading}){
    useEffect(() => {
      lineWobble.register()
    }, []);
    if(loading){
      return (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <l-line-wobble
              size="80"
              stroke="5"
              bg-opacity="0.1"
              speed="1.75" 
              color="black" 
            ></l-line-wobble>
          </Box>
      )
    }else{
      return null
    }
  }
const TaskPage = ({onLogout}) => {
    const [activeTab, setActiveTab] = useState('tasks');
    const [tasks, setTasks] = useState([]);
    const [courses, setCourses] = useState([]);
    const [open, setOpen] = useState(false);

    const [editedTask, setEditedTask] = useState(null);
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
        priority: '',
        courseId: ''
    });
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        completed: false,
        due_date: '',
        priority: '',
        course:null
    });

    useEffect(() => {
        fetchTasks();
        fetchCourses() 
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
            //toast.success('Tasks fetched successfully');
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

    const updateTask = async (taskData) => {
        console.log('Updating task:', taskData.taskId, taskData);
        try {
            // Format the date properly for the backend
            const formattedTask = {
                ...taskData,
                due_date: new Date(taskData.due_date).toISOString().split('T')[0]
            };

            const response = await axios.put(`/api/task/puttaskdetails?taskId=${taskData.taskId}`, formattedTask, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data) {
                setTasks(tasks.map(task => 
                    task.taskId === taskData.taskId ? {
                        ...response.data,
                        due_date: response.data.due_date // Keep the date in the response format
                    } : task
                ));
                //setEditingTaskId(null);
                toast.success('Task updated successfully');
            }
            fetchTasks();
        } catch (error) {
            toast.error('Error updating task');
            console.error('Error updating task:', error.response?.data || error.message);
        }
    };
    
    const handleSave = async (taskData) => {
        if (!taskData) return;
        try {
          await updateTask(taskData);
          setOpenTaskDetails(false);
          fetchTasks(); // Refresh task list
        } catch (error) {
          toast.error('Error saving task');
          console.error(error);
        }
    };

    const fetchCourses = useCallback(async () => {
        try {
            console.log('Fetching courses...');
            const response = await axios.get('/api/course/getallcourse');
            console.log('Courses fetched:', response.data);
            const courseData = Array.isArray(response.data) ? response.data : [];
            console.log(courseData)
            setCourses(courseData);
            console.log('Courses names:', courseData.map(course => course.courseName));
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to fetch courses', 'error');
        }
      }, []);

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
                <Sidebar 
                    onLogout={onLogout}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}/>
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
                                        <MenuItem 
                                            key={priority} 
                                            value={priority}
                                            >
                                                <div className='flex justify-center w-full' style={{backgroundColor: PriorityColors[priority], color: 'white', padding: '0.5rem', borderRadius: '0.25rem'}}>
                                                    {priority}
                                                </div>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="course-select-label">Courses</InputLabel>
                                <Select
                                    labelId="course-select-label"
                                    id="course-select"
                                    label="Courses"
                                    value={newTask.course?.courseId || ''} 
                                    onChange={(e) => setNewTask({
                                        ...newTask, 
                                        course: {
                                            ...newTask.course,
                                            courseId: e.target.value
                                        }
                                    })}>
                                    {courses && courses.length > 0 ? (
                                        courses.map((course) => (
                                            <MenuItem 
                                                key={course.courseId} 
                                                value={course.courseId}
                                            >
                                                <div className='flex justify-center w-full'>
                                                    {course.courseName}
                                                </div>
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>No courses available</MenuItem>
                                    )}
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
                    editedTask={editedTask}
                    setEditedTask={setEditedTask}
                    onClose={() => setOpenTaskDetails(false)} 
                    open={openTaskDetails} 
                    onDelete={handleDelete}
                    onUpdate={() => handleSave(editedTask)}/>
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

const TaskDetailsModal = ({ task, editedTask, setEditedTask, onClose, open, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (task) {
            setEditedTask(task);
            setLoading(false);
        }
    }, [task, setEditedTask]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedTask(prev => ({ ...prev, [name]: value }));
    }

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    }

    const handleSave = () => {
        console.log('Saving task:', editedTask);
        onUpdate(editedTask);
        setIsEditing(false);
    }

    const handleCancel = () => {
        setEditedTask(task);
        setIsEditing(false);
    }
    const formatDate = (date) => {
        const dateObj = new Date(date);
        return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    }
    const formatDisplayDate = (date) => {
        if (!date) return '';
        const dateObj = new Date(date);
        return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    }
    console.log(task)
    if (!task) return null;
    console.log("editing taks!: ", editedTask);
    return (
        <Modal open={open} onClose={onClose}>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] bg-white rounded-lg">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-blue-500">
                    <h2 className="text-xl font-semibold">
                        {isEditing ? 'Editing Mode' : 'Task Details'}
                    </h2>
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <button 
                                    onClick={handleSave}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <Save className="w-5 h-5 text-green-600" />
                                </button>
                                <button 
                                    onClick={handleCancel}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-red-600" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <Edit className="w-5 h-5 text-gray-600" />
                                </button>
                                <button 
                                    onClick={() => onDelete(task.taskId)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        {isEditing ? (
                            <TextField
                                fullWidth
                                name="title"
                                value={editedTask.title}
                                onChange={handleInputChange}
                                variant="outlined"
                                label="Title"
                            />
                        ) : (
                            <h1 className="text-2xl font-bold">{task.title}</h1>
                        )}
                    </div>

                    {/* Status and Due Date */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Status</p>
                            {isEditing ? (
                                <FormControl fullWidth size="small">
                                    <Select
                                        name="completed"
                                        value={editedTask.completed}
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value={false}>Ongoing</MenuItem>
                                        <MenuItem value={true}>Completed</MenuItem>
                                    </Select>
                                </FormControl>
                            ) : (
                                <p className="text-base">{task.completed ? 'Completed' : 'Ongoing'}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Due Date</p>
                            {isEditing ? (
                                <TextField
                                    type="date"
                                    name="due_date"
                                    value={formatDateForInput(editedTask.due_date)}
                                    onChange={handleInputChange}
                                    size="small"
                                    fullWidth
                                />
                            ) : (
                                <p className="text-base">{formatDisplayDate(task.due_date)}</p>
                            )}
                        </div>
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Priority</p>
                        {isEditing ? (
                            <FormControl fullWidth size="small">
                                <Select
                                    name="priority"
                                    value={editedTask.priority}
                                    onChange={handleInputChange}
                                >
                                    {PriorityList.map((priority) => (
                                        <MenuItem key={priority} value={priority}>
                                            <span className={`px-3 py-1 rounded text-black ${PriorityColors[priority]}`}>
                                                {priority}
                                            </span>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : (
                            <div className={`px-3 py-1 rounded text-black`} style={{backgroundColor: PriorityColors[task.priority], color: 'white', padding: '0.5rem', borderRadius: '0.25rem'}}>
                                {task.priority}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Description</p>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            name="description"
                            value={isEditing ? editedTask.description : task.description}
                            onChange={handleInputChange}
                            variant="outlined"
                            InputProps={{
                                readOnly: !isEditing
                            }}
                        />
                    </div>
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
