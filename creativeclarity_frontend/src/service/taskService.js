import axios from 'axios';
import { toast } from 'sonner';

axios.defaults.baseURL = 'http://localhost:8080';

export const fetchTasks = async () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('/api/task/getbyuser/' + currentUser.userId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        toast.success('Tasks fetched successfully');
        return response.data;
    } catch (error) {
        toast.error('Error fetching tasks');
        console.error('Error fetching tasks:', error);
        throw error;
    }
};

export const createTask = async (task) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post('/api/task/posttaskrecord', task, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        toast.success('Task created successfully');
        return response.data;
    } catch (error) {
        toast.error('Error creating task');
        console.error('Error creating task:', error);
        throw error;
    }
};

export const updateTask = async (taskId, updatedTask) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    try {
        const formattedTask = {
            ...updatedTask,
            due_date: new Date(updatedTask.due_date).toISOString().split('T')[0]
        };

        const response = await axios.put(`/api/task/puttaskdetails?taskId=${taskId}`, formattedTask, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        toast.success('Task updated successfully');
        return response.data;
    } catch (error) {
        toast.error('Error updating task');
        console.error('Error updating task:', error);
        throw error;
    }
};

export const deleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.delete(`/api/task/deletetaskdetails/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        
        // Add check for response status
        if (response.status === 200) {
            toast.success('Task deleted successfully');
            return true;
        }
        return false;
    } catch (error) {
        toast.error('Error deleting task');
        console.error('Error deleting task:', error);
        throw error;
    }
};

