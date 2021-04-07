package laptrinhjavaweb.api;



import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.swing.text.html.parser.Entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import laptrinhjavaweb.entity.Team;
import laptrinhjavaweb.entity.User;
import laptrinhjavaweb.entity.Work;
import laptrinhjavaweb.repository.TeamRepository;
import laptrinhjavaweb.repository.UserRepository;
import laptrinhjavaweb.repository.WorkRepository;

@RestController
@RequestMapping(value = "/users")
public class UserAPI {
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private WorkRepository workRepository;
	@Autowired
	private TeamRepository teamRepository;
	
	@GetMapping(value = "/all")
    public List<User> getUsers() {
		List<User> users = userRepository.findAll();
		for(int i=0; i< users.size(); i++){
			Team tmpTeam = teamRepository.findById(users.get(i).teamId);
			users.get(i).setTeamId(tmpTeam.getName());
		}
        return users;
    }
	@GetMapping("/{id}")
	public ResponseEntity<User>getUserById(@PathVariable String id){
		List<Work> works = workRepository.findAll();
		User user = userRepository.findById(id);
		Team tmpTeam = teamRepository.findById(user.teamId);
		user.setTeamId(tmpTeam.getName());
		user.listWork = new ArrayList<Work>();
		for(int i=0; i<works.size(); i++){
			if(works.get(i).userId.equals(id)){
				user.listWork.add(works.get(i));
			}
		}
		return new ResponseEntity<>(user, HttpStatus.OK); 
	}
	@GetMapping("/useredit/{id}")
	public ResponseEntity<User>getUserEditById(@PathVariable String id){	
		User user = userRepository.findById(id);	
		
		return new ResponseEntity<>(user, HttpStatus.OK); 
	}
	
	@PostMapping("/adduser")
	public ResponseEntity<User> createUser(@RequestBody User user){
		UUID uuid = UUID.randomUUID();
		user.id=uuid.toString();
		userRepository.save(user);
		return new ResponseEntity<>(user, HttpStatus.OK); 
	}
	
	@PutMapping("/updateuser/{id}")
	public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User user){
		User userUpdate = userRepository.findById(id);
		userUpdate.setName(user.getName());
		userUpdate.setAddress(user.getAddress());
		userUpdate.setAge(user.getAge());
		userUpdate.setPhone(user.getPhone());
		userUpdate.setSex(user.getSex());
		userUpdate.setStartdate(user.getStartdate());
		userUpdate.setHour(user.getHour());
		userUpdate.setTeamId(user.getTeamId());
		userRepository.save(userUpdate);
		return new ResponseEntity<>(userUpdate, HttpStatus.OK);	
	}
	@DeleteMapping("deleteuser/{id}")
	public ResponseEntity<User> deleteCategory(@PathVariable String id) {
		User userdelete = userRepository.findById(id);
		userRepository.delete(userdelete);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	@GetMapping("/pagination")
	public List<User> List(@RequestParam("page") int page, @RequestParam("size") int size){
		List<User> users = userRepository.findAll();
		List<User> usersPagegin = new ArrayList<User>();
		
		int sizeIndex = size*page;
		if(size*page >= users.size()){
			sizeIndex = users.size();
		}
		for(int i =(page-1)*size; i< sizeIndex; i++){
			
			usersPagegin.add(users.get(i));
		}
		
		//set name group
		for(int i=0; i< usersPagegin.size(); i++){
			Team tmpTeam = teamRepository.findById(usersPagegin.get(i).teamId);
			usersPagegin.get(i).setTeamId(tmpTeam.getName());
		}
		
		return usersPagegin;
		
	}
}
