package com.wmedia.buku.bukumedia.controller;

import com.wmedia.buku.bukumedia.dto.SiswaSummary;
import com.wmedia.buku.bukumedia.model.User;
import com.wmedia.buku.bukumedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Controller

public class DashboardController {
    @Autowired
    private UserRepository userRepository;
    @GetMapping("/")
    public String rootRedirect() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
            if (authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_GURU"))) {
                return "redirect:/guru/dashboard";
            } else if (authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_SISWA"))) {
                return "redirect:/siswa/dashboard";
            }
        }
        return "redirect:/login";
    }
    @GetMapping("/guru/dashboard")
    public String guruDashboard(Authentication authentication, Model model,
            @RequestParam(required = false) String schoolName,
            @RequestParam(required = false) String kelas,
            @RequestParam(required = false) String searchName) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername());
        model.addAttribute("user", user);
        List<SiswaSummary> allSiswa = userRepository.findSummaryByRole("SISWA");
        List<String> schools = allSiswa.stream().map(SiswaSummary::getSchoolName).distinct().sorted()
                .collect(Collectors.toList());
        List<String> classes = allSiswa.stream().map(SiswaSummary::getKelas).distinct().sorted()
                .collect(Collectors.toList());
        model.addAttribute("schools", schools);
        model.addAttribute("classes", classes);
        List<SiswaSummary> filteredSiswa = allSiswa.stream()
                .filter(s -> schoolName == null || schoolName.isEmpty() || s.getSchoolName().equals(schoolName))
                .filter(s -> kelas == null || kelas.isEmpty() || s.getKelas().equals(kelas))
                .filter(s -> searchName == null || searchName.isEmpty()
                        || s.getFullName().toLowerCase().contains(searchName.toLowerCase()))
                .collect(Collectors.toList());
        model.addAttribute("listSiswa", filteredSiswa);
        model.addAttribute("levelNumbers", IntStream.rangeClosed(1, 30).boxed().collect(Collectors.toList()));
        model.addAttribute("selectedSchool", schoolName);
        model.addAttribute("selectedKelas", kelas);
        model.addAttribute("searchName", searchName);
        return "guru_dashboard";
    }
    @GetMapping("/siswa/dashboard")
    public String siswaDashboard(Authentication authentication, Model model) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername());
        model.addAttribute("user", user);
        return "siswa_dashboard";
    }

}