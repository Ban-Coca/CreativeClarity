package com.creative_clarity.Service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.creative_clarity.Entity.NotificationEntity;
import com.creative_clarity.Repository.NotificationRepository;

@Service
public class NotificationService {
	
	@Autowired
	NotificationRepository nrepo;
	
	public NotificationService() {
		super();
	}
	
	//Create of CRUD
	public NotificationEntity postNotificationRecord(NotificationEntity notif) {
		return nrepo.save(notif);
	}
	
	//Read of CRUD
	public List<NotificationEntity> getAllNotifications(){
		return nrepo.findAll();
	}
	
	//Update of CRUD
		@SuppressWarnings("finally")
		public NotificationEntity putNotificationDetails (int notifId, NotificationEntity newNotifDetails) {
			NotificationEntity notif = new NotificationEntity();
			
			try {
				notif = nrepo.findById(notifId).get();
			
				notif.setMessage(newNotifDetails.getMessage());
				notif.setSend_time(newNotifDetails.getSend_time());
				notif.setIs_read(newNotifDetails.getIs_read());
			}catch(NoSuchElementException nex){
				throw new NameNotFoundException("Notification "+ notifId +"not found");
			}finally {
				return nrepo.save(notif);
			}
		}
		
	//Delete of CRUD
	public String deleteNotification(int notifId) {
		String msg = "";
			
		if(nrepo.findById(notifId).isPresent()) {
			nrepo.deleteById(notifId);
			msg = "Notification record successfully deleted!";
		}else {
			msg = "Notification ID "+ notifId +" NOT FOUND!";
		}
		return msg;
	}
}