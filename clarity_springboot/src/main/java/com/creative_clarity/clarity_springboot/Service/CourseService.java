package com.creative_clarity.clarity_springboot.Service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import com.creative_clarity.clarity_springboot.Entity.CourseEntity;
import com.creative_clarity.clarity_springboot.Repository.CourseRepository;

@CrossOrigin(origins = "http://localhost:5173")
@Service
public class CourseService {
	@Autowired
	CourseRepository crepo;
	
	public CourseService() {
		super();
	}
	
	//Create of CRUD
	public CourseEntity postCourseRecord(CourseEntity course) {
		return crepo.save(course);
	}
	
	//Read of CRUD
	public List<CourseEntity> getAllCourses(){
		return crepo.findAll();
	}
	
	//Update of CRUD
	public CourseEntity putCourseDetails (int courseId, CourseEntity newCourseDetails) {
		CourseEntity course = crepo.findById(courseId).orElseThrow(() -> new NoSuchElementException("Course " + courseId + " not found"));
		
		course.setCourseName(newCourseDetails.getCourseName());
		course.setCode(newCourseDetails.getCode());
		course.setSemester(newCourseDetails.getSemester());
		course.setAcademicYear(newCourseDetails.getAcademicYear());
		course.setCreated_at(newCourseDetails.getCreated_at());
		
		return crepo.save(course);
	}
	
	//Delete of CRUD
	public String deleteCourse(int courseId) {
		String msg = "";
		
		if(crepo.findById(courseId).isPresent()) {
			crepo.deleteById(courseId);
			msg = "Course record successfully deleted!";
		}else {
			msg = "Course ID "+ courseId +" NOT FOUND!";
		}
		return msg;
	}
}