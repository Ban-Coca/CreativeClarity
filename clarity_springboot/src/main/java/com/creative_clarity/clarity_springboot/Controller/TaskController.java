package com.creative_clarity.clarity_springboot.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
	@PostMapping("/posttaskrecord")
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
	
}