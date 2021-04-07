package laptrinhjavaweb.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import laptrinhjavaweb.entity.User;
import laptrinhjavaweb.repository.UserRepository;
import laptrinhjavaweb.repository.WorkRepository;

@SpringBootApplication
@EnableMongoRepositories(basePackageClasses = UserRepository.class)
public class Application {
	public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
