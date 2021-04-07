package laptrinhjavaweb.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import laptrinhjavaweb.entity.Team;
import laptrinhjavaweb.entity.Work;

@Repository
public interface TeamRepository extends MongoRepository<Team, String>  {
	Team findById(String id);
}
