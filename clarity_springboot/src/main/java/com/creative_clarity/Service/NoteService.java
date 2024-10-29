package com.creative_clarity.Service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.creative_clarity.Entity.NoteEntity;
import com.creative_clarity.Repository.NoteRepository;

@Service
public class NoteService {
	
	@Autowired
	NoteRepository nrepo;
	
	public NoteService() {
		super();
	}
	
	//Create of CRUD
	public NoteEntity postNoteRecord(NoteEntity note) {
		return nrepo.save(note);
	}
	
	//Read of CRUD
	public List<NoteEntity> getAllNotes(){
		return nrepo.findAll();
	}
	
	//Update of CRUD
	@SuppressWarnings("finally")
	public NoteEntity putNoteDetails (int noteId, NoteEntity newNoteDetails) {
		NoteEntity note = new NoteEntity();
		
		try {
			note = nrepo.findById(noteId).get();
			
			note.setTitle(newNoteDetails.getTitle());
			note.setContent(newNoteDetails.getContent());
			note.setCreated_at(newNoteDetails.getCreated_at());
		}catch(NoSuchElementException nex){
			throw new NameNotFoundException("Note "+ noteId +"not found");
		}finally {
			return nrepo.save(note);
		}
	}
	
	//Delete of CRUD
	public String deleteNote(int noteId) {
		String msg = "";
		
		if(nrepo.findById(noteId).isPresent()) {
			nrepo.deleteById(noteId);
			msg = "Note record successfully deleted!";
		}else {
			msg = "Note ID "+ noteId +" NOT FOUND!";
		}
		return msg;
	}
}