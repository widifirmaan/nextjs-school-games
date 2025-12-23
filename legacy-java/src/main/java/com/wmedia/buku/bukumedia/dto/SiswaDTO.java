package com.wmedia.buku.bukumedia.dto;

import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

public class SiswaDTO {

    private String id;
    private String username;
    private String password;
    private String fullName;
    private String email;
    private Map<String, String> levels = new HashMap<>();
    private String kelas;
    private String schoolName;
    
    // Field for file upload
    private MultipartFile profilePictureFile;
    
    // Field for displaying existing image
    private String photoUrl;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getLevels() {
        return levels;
    }

    public void setLevels(Map<String, String> levels) {
        this.levels = levels;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getKelas() {
        return kelas;
    }

    public void setKelas(String kelas) {
        this.kelas = kelas;
    }

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public MultipartFile getProfilePictureFile() {
        return profilePictureFile;
    }

    public void setProfilePictureFile(MultipartFile profilePictureFile) {
        this.profilePictureFile = profilePictureFile;
    }

    public String getPhotoUrl() {
        if (photoUrl == null || photoUrl.trim().isEmpty()) {
            return "/uploads/0eb4aa23-5d28-4142-88c7-7af41ba46626.png";
        }
        return "/uploads/" + photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}
