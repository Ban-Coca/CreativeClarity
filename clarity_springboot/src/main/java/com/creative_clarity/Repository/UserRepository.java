package com.creative_clarity.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.creative_clarity.Entity.UserEntity;


@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer>{

}