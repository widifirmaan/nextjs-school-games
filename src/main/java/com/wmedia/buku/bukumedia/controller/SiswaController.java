package com.wmedia.buku.bukumedia.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wmedia.buku.bukumedia.dto.SiswaDTO;
import com.wmedia.buku.bukumedia.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

@Controller
@RequestMapping("/guru/siswa")
public class SiswaController {

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/tambah")
    public String showTambahForm(Model model) {
        if (!model.containsAttribute("siswaDTO")) {
            model.addAttribute("siswaDTO", new SiswaDTO());
        }
        return "form_siswa";
    }

    @PostMapping("/tambah")
    public String tambahSiswa(@ModelAttribute SiswaDTO siswaDTO, RedirectAttributes redirectAttributes) {
        if (!userService.isUsernameAvailable(siswaDTO.getUsername())) {
            redirectAttributes.addFlashAttribute("errorMessage", "Username sudah digunakan.");
            redirectAttributes.addFlashAttribute("siswaDTO", siswaDTO);
            return "redirect:/guru/siswa/tambah";
        }
        if (!userService.isEmailAvailable(siswaDTO.getEmail(), null)) {
            redirectAttributes.addFlashAttribute("errorMessage", "Email sudah digunakan.");
            redirectAttributes.addFlashAttribute("siswaDTO", siswaDTO);
            return "redirect:/guru/siswa/tambah";
        }
        
        userService.createSiswa(siswaDTO);
        redirectAttributes.addFlashAttribute("successMessage", "Siswa berhasil ditambahkan.");
        return "redirect:/guru/dashboard";
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable("id") String id, Model model) {
        if (!model.containsAttribute("siswaDTO")) {
            model.addAttribute("siswaDTO", userService.getSiswaDTOById(id));
        }
        return "form_siswa";
    }

    @PostMapping("/edit/{id}")
    public String editSiswa(@PathVariable("id") String id, @ModelAttribute SiswaDTO siswaDTO, RedirectAttributes redirectAttributes) {
        if (!userService.isEmailAvailable(siswaDTO.getEmail(), id)) {
            redirectAttributes.addFlashAttribute("errorMessage", "Email sudah digunakan oleh pengguna lain.");
            redirectAttributes.addFlashAttribute("siswaDTO", siswaDTO);
            return "redirect:/guru/siswa/edit/" + id;
        }

        userService.updateSiswa(id, siswaDTO);
        redirectAttributes.addFlashAttribute("successMessage", "Data siswa berhasil diperbarui.");
        return "redirect:/guru/dashboard";
    }

    @GetMapping("/hapus/{id}")
    public String hapusSiswa(@PathVariable("id") String id, RedirectAttributes redirectAttributes) {
        userService.deleteSiswa(id);
        redirectAttributes.addFlashAttribute("successMessage", "Siswa berhasil dihapus.");
        return "redirect:/guru/dashboard";
    }

    @GetMapping("/{siswaId}/level/{levelKey}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getLevelDetails(@PathVariable String siswaId, @PathVariable String levelKey) {
        try {
            Map<String, Object> levelData = userService.getLevelDetails(siswaId, levelKey);
            if (levelData == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(levelData);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Failed to parse level data"));
        }
    }
}
