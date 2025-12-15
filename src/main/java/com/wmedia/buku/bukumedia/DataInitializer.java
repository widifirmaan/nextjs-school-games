package com.wmedia.buku.bukumedia;

import com.wmedia.buku.bukumedia.model.User;
import com.wmedia.buku.bukumedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // --- GURU ---
        User existingGuru = userRepository.findByUsername("guru");
        if (existingGuru != null) {
            // User ada, reset password saja
            existingGuru.setPassword(passwordEncoder.encode("password"));
            userRepository.save(existingGuru);
            System.out.println("User 'guru' found. Password reset to 'password'.");
        } else {
            // User tidak ada, buat baru
            User guru = new User();
            guru.setUsername("guru");
            guru.setPassword(passwordEncoder.encode("password"));
            guru.setRole("GURU");
            guru.setFullName("Budi Guru");
            guru.setEmail("guru@sekolah.id");
            guru.setSchoolName("SMA Negeri 1");
            guru.setPhotoUrl("https://i.pravatar.cc/150?u=guru");
            userRepository.save(guru);
            System.out.println("User 'guru' created.");
        }

        // --- SISWA ---
        User existingSiswa = userRepository.findByUsername("siswa");
        if (existingSiswa != null) {
            // User ada, reset password saja
            existingSiswa.setPassword(passwordEncoder.encode("password"));
            userRepository.save(existingSiswa);
            System.out.println("User 'siswa' found. Password reset to 'password'.");
        } else {
            // User tidak ada, buat baru
            User siswa = new User();
            siswa.setUsername("siswa");
            siswa.setPassword(passwordEncoder.encode("password"));
            siswa.setRole("SISWA");
            siswa.setFullName("Ani Siswa");
            siswa.setEmail("siswa@sekolah.id");
            siswa.setKelas("XII-A");
            siswa.setSchoolName("SMA Negeri 1");
            siswa.setPhotoUrl("https://i.pravatar.cc/150?u=siswa");
            
            // Tambahkan data level game sample dengan format key baru
            siswa.getLevels().put("level1", "{\"Siapakah_presiden_pertama_Indonesia?\": \"Soekarno\", \"Apa_warna_bendera_Indonesia?\": \"Merah Putih\", \"status\": \"completed\", \"stars\": 3}");
            
            userRepository.save(siswa);
            System.out.println("User 'siswa' created.");
        }
    }
}