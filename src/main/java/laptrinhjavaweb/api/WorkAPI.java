package laptrinhjavaweb.api;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import laptrinhjavaweb.entity.User;
import laptrinhjavaweb.entity.Work;
import laptrinhjavaweb.repository.UserRepository;
import laptrinhjavaweb.repository.WorkRepository;

@RestController
@RequestMapping(value = "/works")
public class WorkAPI {
	@Autowired
	private WorkRepository workRepository;
	
	@PostMapping("/addwork")
	public ResponseEntity<Work> createWork(@RequestBody Work work){
		UUID uuid = UUID.randomUUID();
		work.id=uuid.toString();
		workRepository.save(work);
		return new ResponseEntity<>(work, HttpStatus.OK); 
	}
	
	@GetMapping("/{idemp}")
	public List<Work> getListWorkForUser(@PathVariable String idemp){
		List<Work> works = workRepository.findAll();
		List<Work> workUser = new ArrayList<Work>();
		for (int i=0; i<works.size(); i++){
			if(works.get(i).userId.equals(idemp)){
				workUser.add(works.get(i));
			}
		}
		return workUser;
	}
}
