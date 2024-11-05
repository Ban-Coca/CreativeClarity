package com.creative_clarity.clarity_springboot.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.creative_clarity.clarity_springboot.Entity.GradeEntity;
import com.creative_clarity.clarity_springboot.Service.GradeService;

@RestController
@RequestMapping(method = RequestMethod.GET,path="/api/grade")
public class GradeController {
	@Autowired
	GradeService gserv;
	
	@GetMapping("/print")
	public String print() {
		return "Hello, Course";
	}
	
	//Create of CRUD
	@PostMapping("/postgraderecord")
	public GradeEntity postGradeRecord(@RequestBody GradeEntity course) {
		return gserv.postGradeRecord(course);
	}

	//Read of CRUD
	@GetMapping("/getallgrade")
	public List<GradeEntity> getAllGrades(){
		return gserv.getAllGrades();
	}
		
	//Update of CRUD
	@PutMapping("/putgradedetails")
	public GradeEntity putGradeDetails(@RequestParam int gradeId, @RequestBody GradeEntity newGradeDetails) {
		return gserv.putGradeDetails(gradeId, newGradeDetails);
	}
		
	//Delete of CRUD
	@DeleteMapping("/deletegradedetails/{gradeId}")
	public String deleteGrade(@PathVariable int gradeId) {
		return gserv.deleteGrade(gradeId);
	}
}