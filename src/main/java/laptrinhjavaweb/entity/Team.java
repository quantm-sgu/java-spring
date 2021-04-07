package laptrinhjavaweb.entity;

import java.util.List;

public class Team {

	public String id; 
	public String name;
	public List<User> userteam; 
	public List<User> getUserteam() {
		return userteam;
	}
	public void setUserteam(List<User> userteam) {
		this.userteam = userteam;
	}
	public Team(){
		
	}
	public Team(String id, String name) {
		super();
		this.id = id;
		this.name = name;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	} 
	
}
