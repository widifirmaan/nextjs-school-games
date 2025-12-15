package com.wmedia.buku.bukumedia.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wmedia.buku.bukumedia.model.User;
import com.wmedia.buku.bukumedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/siswa/level")
public class LevelController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/{levelNumber}")
    public String showLevel(@PathVariable int levelNumber, Authentication authentication, Model model) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername());

        // Level 1 is always unlocked
        boolean isUnlocked = (levelNumber == 1);

        // Check if the previous level is completed
        if (levelNumber > 1) {
            String prevLevelKey = "level" + (levelNumber - 1);
            if (user.getLevels().containsKey(prevLevelKey)) {
                isUnlocked = true;
            }
        }

        if (!isUnlocked) {
            return "redirect:/siswa/dashboard?error=locked";
        }

        model.addAttribute("user", user);
        model.addAttribute("levelNumber", levelNumber);

        // Load existing data if available to pre-fill the form
        String currentLevelKey = "level" + levelNumber;
        if (user.getLevels().containsKey(currentLevelKey)) {
            String jsonString = user.getLevels().get(currentLevelKey);
            try {
                Map<String, Object> levelData = objectMapper.readValue(jsonString, Map.class);
                model.addAttribute("levelData", levelData);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // Use a generic template for levels > 1
        if (levelNumber == 1) {
            return "level1";
        } else {
            return "level_generic";
        }
    }

    @PostMapping("/{levelNumber}/submit")
    public String submitLevel(@PathVariable int levelNumber,
                              @RequestParam Map<String, String> allParams,
                              Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername());

        try {
            // Create a new map for the data to save
            Map<String, Object> dataToSave = new HashMap<>(allParams);
            dataToSave.remove("_csrf"); // Remove CSRF token
            dataToSave.put("status", "completed");
            dataToSave.put("stars", 3); // Static stars for now

            // Convert map to JSON string
            String jsonResult = objectMapper.writeValueAsString(dataToSave);

            String currentLevelKey = "level" + levelNumber;
            user.getLevels().put(currentLevelKey, jsonResult);
            userRepository.save(user);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return "redirect:/siswa/dashboard";
    }
}