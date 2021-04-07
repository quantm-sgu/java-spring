package laptrinhjavaweb.entity;

import java.util.Date;

public class Work {

	public String id; 
	public String userId;
	public Date date; 
	public int hour;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public int getHour() {
		return hour;
	}
	public void setHour(int hour) {
		this.hour = hour;
	}
	public Work(){
		
	}
	public Work(String id, Date date, int hour) {
		super();
		this.id = id;
		this.date = date;
		this.hour = hour;
	} 
	
	
}
