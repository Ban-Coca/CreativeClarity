package com.creative_clarity.clarity_springboot.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.creative_clarity.clarity_springboot.Entity.CourseEntity;
import com.creative_clarity.clarity_springboot.Entity.TaskEntity;
import com.creative_clarity.clarity_springboot.Service.TaskService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping(method = RequestMethod.GET,path="/api/task")
public class TaskController {

	@Autowired
	TaskService tserv;
	
	@GetMapping("/print")
	public String print() {
		return "Hello, Course";
	}
	
	//Create of CRUD
	@PostMapping(value = "/posttaskrecord", consumes = "application/json")
	public TaskEntity postTaskRecord(@RequestBody TaskEntity task) {
		return tserv.postTaskRecord(task);
	}

	//Read of CRUD
	@GetMapping("/getalltask")
	public List<TaskEntity> getAllTasks(){
		return tserv.getAllTasks();
	}
	
	//Get tasks by course ID
	@GetMapping("/getbycourse/{courseId}")
	public List<TaskEntity> getTasksByCourseId(@PathVariable int courseId) {
		return tserv.getTasksByCourseId(courseId);
	}
	
	@GetMapping("/getbyuser/{userId}")
	public List<TaskEntity> getTasksByUserId(@PathVariable int userId) {
		return tserv.getTasksByUserId(userId);
	}
	public String getMethodName(@RequestParam String param) {
		return new String();
	}
	
	//Update of CRUD
	@PutMapping("/puttaskdetails")
	public TaskEntity putTaskDetails(@RequestParam("taskId") int taskId, @RequestBody TaskEntity newTaskDetails) {
		return tserv.putTaskDetails(taskId, newTaskDetails);
	}
		
	//Delete of CRUD
	@DeleteMapping("/deletetaskdetails/{taskId}")
	public String deleteTask(@PathVariable int taskId) {
		return tserv.deleteTask(taskId);
	}

	@GetMapping("/getallcourses")
	public List<CourseEntity> getallCourses() {
		return tserv.getAllCourses();
	}
	
	// Newly Added -Jeric
	// Endpoint to archive a completed task
    @PutMapping("/archive/{taskId}")
	public ResponseEntity<String> archiveTask(@PathVariable int taskId) {
		try {
			tserv.archiveCompletedTask(taskId);
			return ResponseEntity.ok("Task archived successfully.");
		} catch (Exception e) {
			// Log the error for easier debugging
			System.err.println("Error while archiving task: " + e.getMessage());
			return ResponseEntity.status(500).body("Error archiving task: " + e.getMessage());
		}
	}

	// Newly Added - Jeric
	// Endpoint to update the completion status of a task
	@PutMapping("/updateCompleted/{taskId}")
    public ResponseEntity<TaskEntity> updateCompleted(@PathVariable int taskId, @RequestParam boolean completed) {
        TaskEntity updatedTask = tserv.updateTaskCompleted(taskId, completed);
        return new ResponseEntity<>(updatedTask, HttpStatus.OK);
    }
}