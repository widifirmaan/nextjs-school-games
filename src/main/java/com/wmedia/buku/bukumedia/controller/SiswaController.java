package com.wmedia.buku.bukumedia.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wmedia.buku.bukumedia.model.User;
import com.wmedia.buku.bukumedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@Controller
@RequestMapping("/guru/siswa")
public class SiswaController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String UPLOAD_DIR = "uploads/";

    @GetMapping("/tambah")
    public String showTambahForm(Model model) {
        model.addAttribute("siswa", new User());
        return "form_siswa";
    }

    @PostMapping("/tambah")
    public String tambahSiswa(User siswa, @RequestParam("profilePictureFile") MultipartFile profilePictureFile) {
        if (!profilePictureFile.isEmpty()) {
            String fileName = saveProfilePicture(profilePictureFile);
            siswa.setPhotoUrl(fileName);
        }
        siswa.setPassword(passwordEncoder.encode(siswa.getPassword()));
        siswa.setRole("SISWA");
        userRepository.save(siswa);
        return "redirect:/guru/dashboard";
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable("id") String id, Model model) {
        User siswa = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid student Id:" + id));
        model.addAttribute("siswa", siswa);
        return "form_siswa";
    }

    @PostMapping("/edit/{id}")
    public String editSiswa(@PathVariable("id") String id, User siswa, @RequestParam("profilePictureFile") MultipartFile profilePictureFile) {
        User existingSiswa = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid student Id:" + id));

        if (!profilePictureFile.isEmpty()) {
            String fileName = saveProfilePicture(profilePictureFile);
            existingSiswa.setPhotoUrl(fileName);
        }

        existingSiswa.setFullName(siswa.getFullName());
        existingSiswa.setKelas(siswa.getKelas());
        existingSiswa.setEmail(siswa.getEmail());
        existingSiswa.setSchoolName(siswa.getSchoolName());
        userRepository.save(existingSiswa);
        return "redirect:/guru/dashboard";
    }

    @GetMapping("/hapus/{id}")
    public String hapusSiswa(@PathVariable("id") String id) {
        User siswa = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid student Id:" + id));
        userRepository.delete(siswa);
        return "redirect:/guru/dashboard";
    }

    @GetMapping("/{siswaId}/level/{levelKey}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getLevelDetails(@PathVariable String siswaId, @PathVariable String levelKey) {
        User siswa = userRepository.findById(siswaId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid student Id:" + siswaId));

        String levelJson = siswa.getLevels().get(levelKey);
        if (levelJson == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            Map<String, Object> levelData = objectMapper.readValue(levelJson, new TypeReference<>() {});
            return ResponseEntity.ok(levelData);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Failed to parse level data"));
        }
    }

    private String saveProfilePicture(MultipartFile file) {
        try {
            // Create the upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath);
            return uniqueFileName;
        } catch (IOException e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }
}
