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

import com.creative_clarity.clarity_springboot.Entity.NoteEntity;
import com.creative_clarity.clarity_springboot.Service.NoteService;

@RestController
@RequestMapping(method = RequestMethod.GET,path="/api/note")
public class NoteController {
	@Autowired
	NoteService nserv;
	
	@GetMapping("/print")
	public String print() {
		return "Hello, Course";
	}
	
	//Create of CRUD
	@PostMapping("/postnoterecord")
	public NoteEntity postNoteRecord(@RequestBody NoteEntity note) {
		return nserv.postNoteRecord(note);
	}

	//Read of CRUD
	@GetMapping("/getallnote")
	public List<NoteEntity> getAllNotes(){
		return nserv.getAllNotes();
	}
		
	//Update of CRUD
	@PutMapping("/putnotedetails")
	public NoteEntity putNoteDetails(@RequestParam int noteId, @RequestBody NoteEntity newNoteDetails) {
		return nserv.putNoteDetails(noteId, newNoteDetails);
	}
		
	//Delete of CRUD
	@DeleteMapping("/deletenotedetails/{noteId}")
	public String deleteNote(@PathVariable int noteId) {
		return nserv.deleteNote(noteId);
	}
}