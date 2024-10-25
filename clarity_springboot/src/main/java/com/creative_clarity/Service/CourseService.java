package com.creative_clarity.clarity_springboot.Service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.creative_clarity.clarity_springboot.Entity.CourseEntity;
import com.creative_clarity.clarity_springboot.Repository.CourseRepository;

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
	@SuppressWarnings("finally")
	public CourseEntity putCourseDetails (int courseId, CourseEntity newCourseDetails) {
		CourseEntity course = new CourseEntity();
		
		try {
			course = crepo.findById(courseId).get();
			
			course.setCourseName(newCourseDetails.getCourseName());
			course.setSubject(newCourseDetails.getSubject());
			course.setStartDate(newCourseDetails.getStartDate());
			course.setEndDate(newCourseDetails.getEndDate());
		}catch(NoSuchElementException nex){
			throw new NameNotFoundException("Course "+ courseId +"not found");
		}finally {
			return crepo.save(course);
		}
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
