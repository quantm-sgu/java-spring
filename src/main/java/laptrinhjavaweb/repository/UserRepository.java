package laptrinhjavaweb.repository;

import java.awt.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import laptrinhjavaweb.entity.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
	User findById(String id);
}
