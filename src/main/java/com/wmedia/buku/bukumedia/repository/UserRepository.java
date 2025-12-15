package com.wmedia.buku.bukumedia.repository;

import com.wmedia.buku.bukumedia.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    User findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByRole(String role);
    Optional<User> findById(String id);
}
