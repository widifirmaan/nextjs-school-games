package com.wmedia.buku.bukumedia.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wmedia.buku.bukumedia.dto.SiswaDTO;
import com.wmedia.buku.bukumedia.dto.SiswaSummary;
import com.wmedia.buku.bukumedia.dto.UserDTO;
import com.wmedia.buku.bukumedia.model.User;
import com.wmedia.buku.bukumedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;
    private final Path uploadPath;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, ObjectMapper objectMapper, Path uploadPath) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
        this.uploadPath = uploadPath;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
    }

    public UserDTO getUserDTOByUsername(String username) {
        return userRepository.findByUsername(username).map(user -> {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setUsername(user.getUsername());
            userDTO.setRole(user.getRole());
            return userDTO;
        }).orElse(null);
    }

    public SiswaDTO getSiswaDTOByUsername(String username) {
        return userRepository.findByUsername(username).map(user -> {
            SiswaDTO siswaDTO = new SiswaDTO();
            siswaDTO.setId(user.getId());
            siswaDTO.setUsername(user.getUsername());
            siswaDTO.setFullName(user.getFullName());
            siswaDTO.setEmail(user.getEmail());
            siswaDTO.setKelas(user.getKelas());
            siswaDTO.setSchoolName(user.getSchoolName());
            siswaDTO.setPhotoUrl(user.getPhotoUrl());
            siswaDTO.setLevels(user.getLevels());
            return siswaDTO;
        }).orElse(null);
    }

    public User createSiswa(SiswaDTO siswaDTO) {
        User siswa = new User();
        siswa.setUsername(siswaDTO.getUsername());
        siswa.setPassword(passwordEncoder.encode(siswaDTO.getPassword()));
        siswa.setFullName(siswaDTO.getFullName());
        siswa.setEmail(siswaDTO.getEmail());
        siswa.setKelas(siswaDTO.getKelas());
        siswa.setSchoolName(siswaDTO.getSchoolName());
        siswa.setRole("SISWA");

        if (siswaDTO.getProfilePictureFile() != null && !siswaDTO.getProfilePictureFile().isEmpty()) {
            String fileName = saveProfilePicture(siswaDTO.getProfilePictureFile());
            siswa.setPhotoUrl(fileName);
        }

        return userRepository.save(siswa);
    }

    public User updateSiswa(String id, SiswaDTO siswaDTO) {
        User existingSiswa = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid student Id:" + id));

        if (siswaDTO.getProfilePictureFile() != null && !siswaDTO.getProfilePictureFile().isEmpty()) {
            String fileName = saveProfilePicture(siswaDTO.getProfilePictureFile());
            existingSiswa.setPhotoUrl(fileName);
        }

        existingSiswa.setFullName(siswaDTO.getFullName());
        existingSiswa.setKelas(siswaDTO.getKelas());
        existingSiswa.setEmail(siswaDTO.getEmail());
        existingSiswa.setSchoolName(siswaDTO.getSchoolName());
        return userRepository.save(existingSiswa);
    }

    public void deleteSiswa(String id) {
        User siswa = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid student Id:" + id));
        userRepository.delete(siswa);
    }

    public SiswaDTO getSiswaDTOById(String id) {
        User siswa = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid student Id:" + id));
        SiswaDTO siswaDTO = new SiswaDTO();
        siswaDTO.setId(siswa.getId());
        siswaDTO.setUsername(siswa.getUsername());
        siswaDTO.setFullName(siswa.getFullName());
        siswaDTO.setEmail(siswa.getEmail());
        siswaDTO.setKelas(siswa.getKelas());
        siswaDTO.setSchoolName(siswa.getSchoolName());
        siswaDTO.setPhotoUrl(siswa.getPhotoUrl());
        return siswaDTO;
    }
    
    public Map<String, Object> getLevelDetails(String siswaId, String levelKey) throws IOException {
        User siswa = userRepository.findById(siswaId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid student Id:" + siswaId));

        String levelJson = siswa.getLevels().get(levelKey);
        if (levelJson == null) {
            return null;
        }

        return objectMapper.readValue(levelJson, new TypeReference<>() {});
    }

    public boolean isEmailAvailable(String email, String userId) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            if (userId != null) {
                return user.get().getId().equals(userId);
            }
            return false;
        }
        return true;
    }
    
    public boolean isUsernameAvailable(String username) {
        return userRepository.findByUsername(username).isEmpty();
    }

    public void submitLevel(String username, int levelNumber, Map<String, String> allParams) throws JsonProcessingException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Map<String, Object> dataToSave = new HashMap<>(allParams);
        dataToSave.remove("_csrf"); // Remove CSRF token if present
        dataToSave.put("status", "completed");
        dataToSave.put("stars", 3); // Example: Add static star rating

        String jsonResult = objectMapper.writeValueAsString(dataToSave);

        String currentLevelKey = "level" + levelNumber;

        user.getLevels().put(currentLevelKey, jsonResult);
        userRepository.save(user);
    }

    public SiswaSummary getSiswaSummaryByUsername(String username) {
        return userRepository.findSummaryByUsername(username);
    }

    public List<SiswaSummary> getAllSiswaSummary() {
        return userRepository.findSummaryByRole("SISWA");
    }

    private String saveProfilePicture(MultipartFile file) {
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            Path filePath = this.uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath);
            return uniqueFileName;
        } catch (IOException e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }
}