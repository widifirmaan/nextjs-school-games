package com.wmedia.buku.bukumedia.repository;

import com.wmedia.buku.bukumedia.dto.SiswaSummary;
import com.wmedia.buku.bukumedia.dto.UserSummary;
import com.wmedia.buku.bukumedia.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    SiswaSummary findSummaryByUsername(String username);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<UserSummary> findByRole(String role);
    Optional<UserSummary> findSummaryById(String id);
    Optional<SiswaSummary> findSiswaByUsername(String username);

    @org.springframework.data.mongodb.repository.Query(value = "{ 'role' : ?0 }", fields = "{ 'id': 1, 'username': 1, 'fullName': 1, 'kelas': 1, 'schoolName': 1, 'levels': 1 }")
    List<SiswaSummary> findSummaryByRole(String role);
}
