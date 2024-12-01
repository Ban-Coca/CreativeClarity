package com.creative_clarity.clarity_springboot.Service;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import java.util.Optional;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Service;

import com.creative_clarity.clarity_springboot.Entity.ArchiveEntity;
import com.creative_clarity.clarity_springboot.Entity.CourseEntity;
import com.creative_clarity.clarity_springboot.Entity.TaskEntity;
import com.creative_clarity.clarity_springboot.Repository.ArchiveRepository;
import com.creative_clarity.clarity_springboot.Repository.CourseRepository;
import com.creative_clarity.clarity_springboot.Repository.TaskRepository;
import com.creative_clarity.clarity_springboot.Repository.CourseRepository;
import com.creative_clarity.clarity_springboot.Entity.CourseEntity;
@Service
public class TaskService {

	@Autowired
	TaskRepository trepo;
	@Autowired
    CourseRepository courseRepository;

    @Autowired
    CourseService courseService;
    @Autowired
    private ArchiveRepository archiveRepository;
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
 
     // Get tasks by user ID
     public List<TaskEntity> getTasksByUserId(int userId) {
         // Get courses for user
         List<CourseEntity> userCourses = courseService.findByUserId(userId);
         
         // Collect all tasks from user's courses
         return userCourses.stream()
             .flatMap(course -> course.getTasks().stream())
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
     // Method to archive completed tasks
	public void archiveCompletedTask(int taskId) {
		System.out.println("Task ID "+taskId);
	    Optional<TaskEntity> taskOptional = trepo.findById(taskId);
	    
	    if (!taskOptional.isPresent()) {
	        throw new IllegalArgumentException("Task not found");
	    }
		
	    TaskEntity task = taskOptional.get();
	    if (!task.getIsCompleted()) {
	        throw new IllegalArgumentException("Task is not completed");
	    }
	    
		System.out.println("Task Title: " + task.getTitle());
		System.out.println("Task Description: " + task.getDescription());

	    CourseEntity course = task.getCourse();
    
		// Create the ArchiveEntity
		ArchiveEntity archive = new ArchiveEntity();
		archive.setTitle(task.getTitle());
		archive.setDescription(task.getDescription());
		archive.setType("Task");
		archive.setArchive_date(new Date());
		archive.setTags("Completed Task");
		archive.setCourse(course);

		archiveRepository.save(archive);

		// Set the task as archived
		task.setIsArchived(true);
		trepo.save(task);
	}

	// Method to update the 'completed' field of a task
    public TaskEntity updateTaskCompleted(int taskId, boolean completed) {
        // Fetch the task by ID
        Optional<TaskEntity> taskOptional = trepo.findById(taskId);
        
        TaskEntity task = taskOptional.get();
        
        // Update the 'completed' field
        task.setCompleted(completed);
        
        // Save the updated task back to the repository
        return trepo.save(task);
    }
}