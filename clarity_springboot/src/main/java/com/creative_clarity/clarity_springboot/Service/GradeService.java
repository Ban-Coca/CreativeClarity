package com.creative_clarity.clarity_springboot.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.creative_clarity.clarity_springboot.Entity.GradeEntity;
import com.creative_clarity.clarity_springboot.Repository.CourseRepository;
import com.creative_clarity.clarity_springboot.Repository.GradeRepository;

@Service
public class GradeService {
    
    private static final Logger logger = LoggerFactory.getLogger(GradeService.class);
    
    @Autowired
    GradeRepository grepo;
    
    @Autowired
    CourseRepository courseRepo; // Add this line to inject CourseRepository
    
    public GradeService() {
        super();
    }
    
    // Create of CRUD
    public GradeEntity postGradeRecord(GradeEntity grade) {
        return grepo.save(grade);
    }

    public List<GradeEntity> getAllGrades(){
    	return grepo.findAll();
    }
    
    // Read of CRUD
    public List<GradeEntity> getAllGradesByCourse(int courseId) {
        logger.info("Fetching grades for courseId: {}", courseId);
        try {
            List<GradeEntity> grades = grepo.findAll().stream()
                    .filter(grade -> grade.getCourse().getCourseId() == courseId)
                    .collect(Collectors.toList());
            logger.info("Found {} grades for courseId: {}", grades.size(), courseId);
            return grades;
        } catch (Exception e) {
            logger.error("Error fetching grades for courseId: {}", courseId, e);
            throw new RuntimeException("Failed to fetch grades for courseId: " + courseId, e);
        }
    }
    
    // Update of CRUD
    public GradeEntity putGradeDetails(int gradeId, GradeEntity newGradeDetails) {
        GradeEntity grade = grepo.findById(gradeId).orElseThrow(() -> new NoSuchElementException("Grade " + gradeId + " not found"));
        grade.setTotal_points(newGradeDetails.getTotal_points());
        grade.setScore(newGradeDetails.getScore());
        grade.setDateRecorded(newGradeDetails.getDateRecorded());
        grade.setCourse(newGradeDetails.getCourse());
        grade.setAssessment_type(newGradeDetails.getAssessment_type());
        return grepo.save(grade);
    }
    
    // Delete of CRUD
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