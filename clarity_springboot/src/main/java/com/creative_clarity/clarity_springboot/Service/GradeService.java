package com.creative_clarity.clarity_springboot.Service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.creative_clarity.clarity_springboot.Entity.GradeEntity;
import com.creative_clarity.clarity_springboot.Repository.GradeRepository;

@Service
public class GradeService {
	
	@Autowired
	GradeRepository grepo;
	
	public GradeService() {
		super();
	}
	
	//Create of CRUD
	public GradeEntity postGradeRecord(GradeEntity grade) {
		return grepo.save(grade);
	}
	
	//Read of CRUD
	public List<GradeEntity> getAllGrades(){
		return grepo.findAll();
	}
	
	//Update of CRUD
	@SuppressWarnings("finally")
	public GradeEntity putGradeDetails (int gradeId, GradeEntity newGradeDetails) {
		GradeEntity grade = new GradeEntity();
		
		grade.setGradeType(newGradeDetails.getGradeType());
		grade.setTotal_points(newGradeDetails.getTotal_points());
		grade.setScore(newGradeDetails.getScore());
		try {
			grade = grepo.findById(gradeId).get();
		}catch(NoSuchElementException nex){
			throw new NameNotFoundException("Grade "+ gradeId +"not found");
		}finally {
			return grepo.save(grade);
		}
	}
	
	//Delete of CRUD
	public String deleteGrade(int gradeId) {
		String msg = "";
		
		if(grepo.findById(gradeId).isPresent()) {
			grepo.deleteById(gradeId);
			msg = "Grade record successfully deleted!";
		}else {
			msg = "Grade ID "+ gradeId +" NOT FOUND!";
		}
		return msg;
	}
}