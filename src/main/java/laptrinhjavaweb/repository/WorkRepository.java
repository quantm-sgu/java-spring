package laptrinhjavaweb.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import laptrinhjavaweb.entity.User;
import laptrinhjavaweb.entity.Work;

@Repository
public interface WorkRepository extends MongoRepository<Work, String> {
	Work findById(String id);
}
