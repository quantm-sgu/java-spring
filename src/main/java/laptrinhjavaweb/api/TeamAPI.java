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

import laptrinhjavaweb.entity.Team;
import laptrinhjavaweb.entity.User;
import laptrinhjavaweb.entity.Work;
import laptrinhjavaweb.repository.TeamRepository;
import laptrinhjavaweb.repository.UserRepository;
import laptrinhjavaweb.repository.WorkRepository;

@RestController
@RequestMapping(value = "/teams")
public class TeamAPI {
	@Autowired
	private TeamRepository teamRepository;
	@Autowired
	private UserRepository userRepository;
	@GetMapping(value = "/all")
    public List<Team> getTeams(){
        return teamRepository.findAll();
    }
	@GetMapping("/{id}")
	public ResponseEntity<Team>getTeamById(@PathVariable String id){
		List<User> users = userRepository.findAll();
		Team team = teamRepository.findById(id);
		team.userteam = new ArrayList<User>();
		for(int i=0; i<users.size(); i++){
			if(users.get(i).teamId.equals(id)){
				team.userteam.add(users.get(i));
			}
		}
		return new ResponseEntity<>(team, HttpStatus.OK);
	}
	@PostMapping("/addteam")
	public ResponseEntity<Team> createWork(@RequestBody Team team){
		UUID uuid = UUID.randomUUID();
		team.id=uuid.toString();
		teamRepository.save(team);
		return new ResponseEntity<>(team, HttpStatus.OK); 
	}
	
}