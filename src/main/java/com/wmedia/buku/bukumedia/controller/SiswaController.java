package com.wmedia.buku.bukumedia.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wmedia.buku.bukumedia.dto.SiswaDTO;
import com.wmedia.buku.bukumedia.model.User;
import com.wmedia.buku.bukumedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;
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
        if (!model.containsAttribute("siswaDTO")) {
            model.addAttribute("siswaDTO", new SiswaDTO());
        }
        return "form_siswa";
    }

    @PostMapping("/tambah")
    public String tambahSiswa(@ModelAttribute SiswaDTO siswaDTO, RedirectAttributes redirectAttributes) {
        if (userRepository.findByUsername(siswaDTO.getUsername()) != null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Username sudah digunakan.");
            redirectAttributes.addFlashAttribute("siswaDTO", siswaDTO);
            return "redirect:/guru/siswa/tambah";
        }
        if (userRepository.findByEmail(siswaDTO.getEmail()).isPresent()) {
            redirectAttributes.addFlashAttribute("errorMessage", "Email sudah digunakan.");
            redirectAttributes.addFlashAttribute("siswaDTO", siswaDTO);
            return "redirect:/guru/siswa/tambah";
        }
        
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

        userRepository.save(siswa);
        redirectAttributes.addFlashAttribute("successMessage", "Siswa berhasil ditambahkan.");
        return "redirect:/guru/dashboard";
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable("id") String id, Model model) {
        if (!model.containsAttribute("siswaDTO")) {
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
            model.addAttribute("siswaDTO", siswaDTO);
        }
        return "form_siswa";
    }

    @PostMapping("/edit/{id}")
    public String editSiswa(@PathVariable("id") String id, @ModelAttribute SiswaDTO siswaDTO, RedirectAttributes redirectAttributes) {
        User existingSiswa = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid student Id:" + id));

        // Validasi Email (jika diubah)
        if (!existingSiswa.getEmail().equals(siswaDTO.getEmail())) {
            Optional<User> userWithSameEmail = userRepository.findByEmail(siswaDTO.getEmail());
            if (userWithSameEmail.isPresent()) {
                redirectAttributes.addFlashAttribute("errorMessage", "Email sudah digunakan oleh pengguna lain.");
                redirectAttributes.addFlashAttribute("siswaDTO", siswaDTO);
                return "redirect:/guru/siswa/edit/" + id;
            }
        }

        if (siswaDTO.getProfilePictureFile() != null && !siswaDTO.getProfilePictureFile().isEmpty()) {
            String fileName = saveProfilePicture(siswaDTO.getProfilePictureFile());
            existingSiswa.setPhotoUrl(fileName);
        }

        existingSiswa.setFullName(siswaDTO.getFullName());
        existingSiswa.setKelas(siswaDTO.getKelas());
        existingSiswa.setEmail(siswaDTO.getEmail());
        existingSiswa.setSchoolName(siswaDTO.getSchoolName());
        userRepository.save(existingSiswa);
        redirectAttributes.addFlashAttribute("successMessage", "Data siswa berhasil diperbarui.");
        return "redirect:/guru/dashboard";
    }

    @GetMapping("/hapus/{id}")
    public String hapusSiswa(@PathVariable("id") String id, RedirectAttributes redirectAttributes) {
        User siswa = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid student Id:" + id));
        userRepository.delete(siswa);
        redirectAttributes.addFlashAttribute("successMessage", "Siswa berhasil dihapus.");
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
