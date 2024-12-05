package com.creative_clarity.clarity_springboot.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.creative_clarity.clarity_springboot.Entity.CourseEntity;
import com.creative_clarity.clarity_springboot.Repository.CourseRepository;

import jakarta.transaction.Transactional;

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
		List<CourseEntity> courses = crepo.findAll();
		return courses.stream().map(course -> {
			course.getGrades().forEach(grade -> grade.setCourse(null));
			return course;
		}).collect(Collectors.toList());
	}

	//Read of CRUD
	public Optional<CourseEntity> getCourseById(int courseId){
		return crepo.findById(courseId);
	}
	
	//GET COURSE BY USER ID
	public List<CourseEntity> getCourseByUserId(int userId){
		List<CourseEntity> courses = findByUserId(userId);
		return courses.stream().map(course -> {
			course.getGrades().forEach(grade -> grade.setCourse(null));
			return course;
		}).collect(Collectors.toList());
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
	@Transactional
	public String deleteCourse(int courseId) {
		String msg = "";
		
		if(crepo.findById(courseId).isPresent()) {
			CourseEntity course = crepo.findById(courseId).get();
			course.getGrades().forEach(grade -> grade.setCourse(null));
			course.getTasks().forEach(task -> task.setCourse(null));
			course.getPhotos().forEach(photo -> photo.setCourse(null));
			course.setUser(null);
			crepo.save(course);
			crepo.deleteById(courseId);
			msg = "Course record successfully deleted!";
		}else {
			msg = "Course ID "+ courseId +" NOT FOUND!";
		}
		return msg;
	}

	//helper method
	public List<CourseEntity> findByUserId(int userId) {
		List<CourseEntity> userCourses = crepo.findAll().stream()
			.filter(course -> course.getUser() != null && 
							 course.getUser().getUserId() == userId)
			.map(course -> {
				course.getGrades().forEach(grade -> grade.setCourse(null));
				return course;
			})
			.collect(Collectors.toList());
	
		// if (userCourses.isEmpty()) {
		// 	throw new NoSuchElementException("No courses found for user ID: " + userId);
		// }
		return userCourses;
	}
}