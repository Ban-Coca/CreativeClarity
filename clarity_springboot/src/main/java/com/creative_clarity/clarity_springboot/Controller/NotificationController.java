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

import com.creative_clarity.clarity_springboot.Entity.NotificationEntity;
import com.creative_clarity.clarity_springboot.Service.NotificationService;

@RestController
@RequestMapping(method = RequestMethod.GET,path="/api/notification")
public class NotificationController {
	
	@Autowired
	NotificationService nserv;
	
	@GetMapping("/print")
	public String print() {
		return "Hello, Course";
	}
	
	//Create of CRUD
	@PostMapping("/postnotificationrecord")
	public NotificationEntity postNotificationRecord(@RequestBody NotificationEntity notif) {
		return nserv.postNotificationRecord(notif);
	}

	//Read of CRUD
	@GetMapping("/getallnotification")
	public List<NotificationEntity> getAllNotifications(){
		return nserv.getAllNotifications();
	}
		
	//Update of CRUD
	@PutMapping("/putnotificationdetails")
	public NotificationEntity putNotificationDetails(@RequestParam int notifId, @RequestBody NotificationEntity newNotifDetails) {
		return nserv.putNotificationDetails(notifId, newNotifDetails);
	}
		
	//Delete of CRUD
	@DeleteMapping("/deletenotificationdetails/{notifId}")
	public String deleteNotification(@PathVariable int notifId) {
		return nserv.deleteNotification(notifId);
	}
}