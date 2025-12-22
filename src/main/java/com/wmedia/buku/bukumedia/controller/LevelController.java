package com.wmedia.buku.bukumedia.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wmedia.buku.bukumedia.dto.SiswaSummary;
import com.wmedia.buku.bukumedia.service.UserService;
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
import java.util.Map;

@Controller
@RequestMapping("/siswa/level")
public class LevelController {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserService userService;

    @GetMapping("/{levelNumber}")
    public String showLevel(@PathVariable int levelNumber, Authentication authentication, Model model) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        // Use the projection to fetch only necessary data
        SiswaSummary userSummary = userService.getSiswaSummaryByUsername(userDetails.getUsername());

        // Level 1 is always unlocked
        boolean isUnlocked = (levelNumber == 1);

        // Check if the previous level is completed using the projection
        if (levelNumber > 1) {
            String prevLevelKey = "level" + (levelNumber - 1);
            if (userSummary.getLevels().containsKey(prevLevelKey)) {
                isUnlocked = true;
            }
        }

        if (!isUnlocked) {
            return "redirect:/siswa/dashboard?error=locked";
        }

        model.addAttribute("levelNumber", levelNumber);

        // Load existing data if available to pre-fill the form
        String currentLevelKey = "level" + levelNumber;
        if (userSummary.getLevels().containsKey(currentLevelKey)) {
            String jsonString = userSummary.getLevels().get(currentLevelKey);
            try {
                Map<String, Object> levelData = objectMapper.readValue(jsonString, Map.class);
                model.addAttribute("levelData", levelData);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return  "level" + levelNumber;
    }

    @PostMapping("/{levelNumber}/submit")
    public String submitLevel(@PathVariable int levelNumber,
                              @RequestParam Map<String, String> allParams,
                              Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        try {
            userService.submitLevel(userDetails.getUsername(), levelNumber, allParams);
        } catch (Exception e) {
            // Log the exception for debugging
            e.printStackTrace();
        }

        return "redirect:/siswa/dashboard";
    }
}