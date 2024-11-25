package com.creative_clarity.clarity_springboot.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.creative_clarity.clarity_springboot.Entity.ArchiveEntity;
import com.creative_clarity.clarity_springboot.Entity.CourseEntity;

@Repository
public interface ArchiveRepository extends JpaRepository<ArchiveEntity, Integer>{
    List<ArchiveEntity> findByCourse(CourseEntity course);
}