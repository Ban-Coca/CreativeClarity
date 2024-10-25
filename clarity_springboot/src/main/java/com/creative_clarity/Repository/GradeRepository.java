package com.creative_clarity.clarity_springboot.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.creative_clarity.clarity_springboot.Entity.GradeEntity;

@Repository
public interface GradeRepository extends JpaRepository<GradeEntity, Integer>{

}