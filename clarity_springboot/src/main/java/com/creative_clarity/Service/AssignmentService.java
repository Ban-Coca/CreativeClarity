package com.creative_clarity.clarity_springboot.Service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.creative_clarity.clarity_springboot.Entity.AssignmentEntity;
import com.creative_clarity.clarity_springboot.Repository.AssignmentRepository;

@Service
public class AssignmentService {
	@Autowired
	AssignmentRepository arepo;
	
	public AssignmentService() {
		super();
	}
	
	//Create of CRUD
	public AssignmentEntity postAssignmentRecord(AssignmentEntity assignment) {
		return arepo.save(assignment);
	}
	
	//Read of CRUD
	public List<AssignmentEntity> getAllAssignments(){
		return arepo.findAll();
	}
	
	//Update of CRUD
	@SuppressWarnings("finally")
	public AssignmentEntity putAssignmentDetails (int assignmentId, AssignmentEntity newAssignmentDetails) {
		AssignmentEntity assignment = new AssignmentEntity();
		
		try {
			assignment = arepo.findById(assignmentId).get();
			
			assignment.setTitle(newAssignmentDetails.getTitle());
			assignment.setDescription(newAssignmentDetails.getDescription());
			assignment.setScore(newAssignmentDetails.getScore());
			assignment.setDue_date(newAssignmentDetails.getDue_date());
		}catch(NoSuchElementException nex){
			throw new NameNotFoundException("Assignment "+ assignmentId +"not found");
		}finally {
			return arepo.save(assignment);
		}
	}
	
	//Delete of CRUD
	public String deleteAssignment(int assignmentId) {
		String msg = "";
		
		if(arepo.findById(assignmentId).isPresent()) {
			arepo.deleteById(assignmentId);
			msg = "Assignment record successfully deleted!";
		}else {
			msg = "Assignment ID "+ assignmentId +" NOT FOUND!";
		}
		return msg;
	}
}
