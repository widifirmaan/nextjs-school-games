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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

@Controller
@RequestMapping("/guru/siswa")
public class SiswaController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/tambah")
    public String showTambahForm(Model model) {
        model.addAttribute("siswa", new User());
        return "form_siswa";
    }

    @PostMapping("/tambah")
    public String tambahSiswa(User siswa) {
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
    public String editSiswa(@PathVariable("id") String id, User siswa) {
        User existingSiswa = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid student Id:" + id));
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
}