package com.creative_clarity.clarity_springboot.Service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.creative_clarity.clarity_springboot.Entity.ArchiveEntity;
import com.creative_clarity.clarity_springboot.Repository.ArchiveRepository;

@Service
public class ArchiveService {
	@Autowired
	ArchiveRepository arepo;
	
	public ArchiveService() {
		super();
	}
	
	//Create of CRUD
	public ArchiveEntity postArchiveRecord(ArchiveEntity archive) {
		return arepo.save(archive);
	}
	
	//Read of CRUD
	public List<ArchiveEntity> getAllArchives(){
		return arepo.findAll();
	}
	
	//Update of CRUD
	@SuppressWarnings("finally")
	public ArchiveEntity putArchiveDetails (int archiveId, ArchiveEntity newArchiveDetails) {
		ArchiveEntity archive = new ArchiveEntity();
		
		try {
			archive = arepo.findById(archiveId).get();
			
			archive.setTitle(newArchiveDetails.getTitle());
			archive.setType(newArchiveDetails.getType());
			archive.setArchive_date(newArchiveDetails.getArchive_date());
			archive.setTags(newArchiveDetails.getTags());
		}catch(NoSuchElementException nex){
			throw new NameNotFoundException("Archive "+ archiveId +"not found");
		}finally {
			return arepo.save(archive);
		}
	}
	
	//Delete of CRUD
	public String deleteArchive(int archiveId) {
		String msg = "";
		
		if(arepo.findById(archiveId).isPresent()) {
			arepo.deleteById(archiveId);
			msg = "Archive record successfully deleted!";
		}else {
			msg = "Archive ID "+ archiveId +" NOT FOUND!";
		}
		return msg;
	}
}
