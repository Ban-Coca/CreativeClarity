import axios from 'axios';
import { toast } from 'sonner';

axios.defaults.baseURL = 'http://localhost:8080';

export const fetchTasks = async () => {
    try {
        const response = await axios.get('/api/task/getalltask', {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
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
    try {
        const response = await axios.post('/api/task/posttaskrecord', task, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
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
    try {
        const formattedTask = {
            ...updatedTask,
            due_date: new Date(updatedTask.due_date).toISOString().split('T')[0]
        };

        const response = await axios.put(`/api/task/puttaskdetails?taskId=${taskId}`, formattedTask, {
            headers: {
                'Content-Type': 'application/json'
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
    try {
        await axios.delete(`/api/task/deletetaskdetails/${taskId}`);
        toast.success('Task deleted successfully');
    } catch (error) {
        toast.error('Error deleting task');
        console.error('Error deleting task:', error);
        throw error;
    }
};

