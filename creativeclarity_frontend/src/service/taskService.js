import axios from "axios";
import { toast } from "sonner";


axios.defaults.baseURL = "http://localhost:8080/";

export const fetchTasks = async () => {
    try {
        const API_URL = '/api/task/getalltask';
        const response = await axios.get(API_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
        toast.success('Tasks fetched successfully');
    } catch (error) {
        toast.error('Error fetching tasks');
        console.error('Error fetching tasks:', error);
    }
};

export const createTask = async (task) => {
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

export const updateTask = async (taskId, updatedTask) => {
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

export const deleteTask = async (taskId) => {
    try {
        const response = await axios.delete(`/api/task/deletetaskdetails/${taskId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
        toast.success('Task deleted successfully');
        return response.data;
    } catch (error) {
        toast.error('Error deleting task');
        console.error('Error deleting task:', error);
    }
};