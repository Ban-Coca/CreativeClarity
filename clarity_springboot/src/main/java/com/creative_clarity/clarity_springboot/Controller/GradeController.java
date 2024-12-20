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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.creative_clarity.clarity_springboot.Entity.GradeEntity;
import com.creative_clarity.clarity_springboot.Service.GradeService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/grade")
public class GradeController {
    @Autowired
    GradeService gserv;
    
    @GetMapping("/print")
    public String print() {
        return "Hello, Grade";
    }
    
    // Create of CRUD
    @PostMapping(value = "/postgraderecord", consumes = {"application/json"})
    public GradeEntity postGradeRecord(@RequestBody GradeEntity grade) {
        return gserv.postGradeRecord(grade);
    }

    // Read of CRUD
    @GetMapping("/getallgrades")
    public List<GradeEntity> getAllGrades() {
        return gserv.getAllGrades();
    }
    
    // Read of CRUD
    @GetMapping("/getallgradesbycourse/{courseId}")
    public List<GradeEntity> getAllGradesByCourse(@PathVariable int courseId) {
        return gserv.getAllGradesByCourse(courseId);
    }
        
    // Update of CRUD
    @PutMapping("/putgradedetails")
    public GradeEntity putGradeDetails(@RequestParam int gradeId, @RequestBody GradeEntity newGradeDetails) {
        return gserv.putGradeDetails(gradeId, newGradeDetails);
    }
        
    // Delete of CRUD
    @DeleteMapping("/deletegradedetails/{gradeId}")
    public String deleteGrade(@PathVariable int gradeId) {
        return gserv.deleteGrade(gradeId);
    }
}