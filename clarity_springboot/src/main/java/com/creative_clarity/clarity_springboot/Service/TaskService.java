package com.creative_clarity.clarity_springboot.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.creative_clarity.clarity_springboot.Entity.TaskEntity;
import com.creative_clarity.clarity_springboot.Repository.TaskRepository;
import com.creative_clarity.clarity_springboot.Repository.CourseRepository;
import com.creative_clarity.clarity_springboot.Entity.CourseEntity;
@Service
public class TaskService {

    @Autowired
    TaskRepository trepo;
    
    @Autowired
    CourseRepository courseRepository;

    public TaskService() {
        super();
    }
    
    //Create of CRUD
    public TaskEntity postTaskRecord(TaskEntity task) {
        return trepo.save(task);
    }
    
    //Read of CRUD
    public List<TaskEntity> getAllTasks(){
        return trepo.findAll();
    }
    
    //Update of CRUD
    @SuppressWarnings("finally")
    public TaskEntity putTaskDetails (int taskId, TaskEntity newTaskDetails) {
        TaskEntity task = new TaskEntity();
        
        try {
            task = trepo.findById(taskId).get();
            
            task.setDescription(newTaskDetails.getDescription());
            task.setTitle(newTaskDetails.getTitle());
            task.setDue_date(newTaskDetails.getDue_date());
            task.setCompleted(newTaskDetails.getIsCompleted());
            task.setPriority(newTaskDetails.getPriority());
        }catch(NoSuchElementException nex){
            throw new NameNotFoundException("User "+ taskId +"not found");
        }finally {
            return trepo.save(task);
        }
    }
    
    //Delete of CRUD
    public String deleteTask(int taskId) {
        String msg = "";
        
        if(trepo.findById(taskId).isPresent()) {
            trepo.deleteById(taskId);
            msg = "Task record successfully deleted!";
        }else {
            msg = "Task ID "+ taskId +" NOT FOUND!";
        }
        return msg;
    }
    
    // Get tasks by course ID
    public List<TaskEntity> getTasksByCourseId(int courseId) {
       return trepo.findAll().stream()
               .filter(task -> task.getCourse() != null && task.getCourse().getCourseId() == courseId)
               .collect(Collectors.toList());
    }

    // New method to get all courses
    public List<CourseEntity> getAllCourses() {
        return courseRepository.findAll();
    }
    
    //
    public CourseEntity getCourseById(int courseId) {
        return courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
    }
}