package com.wmedia.buku.bukumedia.repository;

import com.wmedia.buku.bukumedia.dto.SiswaSummary;
import com.wmedia.buku.bukumedia.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    User findByUsername(String username);
    SiswaSummary findSummaryByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByRole(String role);
    Optional<User> findById(String id);

    @org.springframework.data.mongodb.repository.Query(value = "{ 'role' : ?0 }", fields = "{ 'id': 1, 'username': 1, 'fullName': 1, 'kelas': 1, 'schoolName': 1, 'levels': 1 }")
    List<SiswaSummary> findSummaryByRole(String role);
}
