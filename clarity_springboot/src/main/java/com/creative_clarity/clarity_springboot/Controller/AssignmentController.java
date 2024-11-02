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

import com.creative_clarity.clarity_springboot.Entity.AssignmentEntity;
import com.creative_clarity.clarity_springboot.Service.AssignmentService;

@CrossOrigin(origins = "http://localhost:5173") // Allow your React app's origin
@RestController
@RequestMapping(method = RequestMethod.GET,path="/api/assignments")
public class AssignmentController {
	@Autowired
	AssignmentService aserv;
	
	@GetMapping("/print")
	public String print() {
		return "Hello, Assignment";
	}
	
	//Create of CRUD
	@PostMapping("/postassignmentrecord")
	public AssignmentEntity postAssignmentRecord(@RequestBody AssignmentEntity assignment) {
		return aserv.postAssignmentRecord(assignment);
	}

	//Read of CRUD
	@GetMapping("/getallassignments")
	public List<AssignmentEntity> getAllAssignments(){
		return aserv.getAllAssignments();
	}
		
	//Update of CRUD
	@PutMapping("/putassignmentdetails")
	public AssignmentEntity putAssignemntDetails(@RequestParam int assignmentId, @RequestBody AssignmentEntity newAssignmentDetails) {
		return aserv.putAssignmentDetails(assignmentId, newAssignmentDetails);
	}
		
	//Delete of CRUD
	@DeleteMapping("/deleteassignmentdetails/{assignmentId}")
	public String deleteAssignment(@PathVariable int assignmentId) {
		return aserv.deleteAssignment(assignmentId);
	}
}
