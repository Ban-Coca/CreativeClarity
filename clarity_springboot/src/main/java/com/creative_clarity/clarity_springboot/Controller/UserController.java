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

import com.creative_clarity.clarity_springboot.Entity.UserEntity;
import com.creative_clarity.clarity_springboot.Service.UserService;

@RestController
@RequestMapping(method = RequestMethod.GET,path="/api/user")
public class UserController {
	
	@Autowired
	UserService userv;
	
	@GetMapping("/print")
	public String print() {
		return "Hello, User";
	}
	
	//Create of CRUD
	@PostMapping("/postuserrecord")
	public UserEntity postStudentRecord(@RequestBody UserEntity user) {
		return userv.postUserRecord(user);
	}

	//Read of CRUD
	@GetMapping("/getallusers")
	public List<UserEntity> getAllUsers(){
		return userv.getAllUsers();
	}
		
	//Update of CRUD
	@PutMapping("/putuserdetails")
	public UserEntity putUserDetails(@RequestParam int userId, @RequestBody UserEntity newUserDetails) {
		return userv.putUserDetails(userId, newUserDetails);
	}
		
	//Delete of CRUD
	@DeleteMapping("/deleteuserdetails/{userId}")
	public String deleteUser(@PathVariable int userId) {
		return userv.deleteUser(userId);
	}
}