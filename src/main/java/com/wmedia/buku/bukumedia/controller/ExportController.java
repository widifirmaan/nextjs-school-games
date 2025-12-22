package com.wmedia.buku.bukumedia.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wmedia.buku.bukumedia.dto.SiswaSummary;
import com.wmedia.buku.bukumedia.service.ExcelExportService;
import com.wmedia.buku.bukumedia.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class ExportController {

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ExcelExportService excelExportService;

    @GetMapping("/guru/export")
    public void exportToExcel(HttpServletResponse response,
                              @RequestParam(required = false) String schoolName,
                              @RequestParam(required = false) String kelas,
                              @RequestParam(required = false) String searchName) throws IOException {

        // 1. Fetch and filter data using the correct projection
        List<SiswaSummary> filteredSiswa = userService.getAllSiswaSummary().stream()
            .filter(s -> schoolName == null || schoolName.isEmpty() || s.getSchoolName().equals(schoolName))
            .filter(s -> kelas == null || kelas.isEmpty() || s.getKelas().equals(kelas))
            .filter(s -> searchName == null || searchName.isEmpty() || s.getFullName().toLowerCase().contains(searchName.toLowerCase()))
            .collect(Collectors.toList());

        // 2. Prepare headers
        List<String> headers = new ArrayList<>(List.of("Nama Lengkap", "Kelas", "Sekolah", "Email"));
        for (int i = 1; i <= 30; i++) {
            headers.add("Level " + i);
        }


        List<List<Object>> data = new ArrayList<>();
        for (SiswaSummary siswa : filteredSiswa) {
            List<Object> row = new ArrayList<>();
            row.add(siswa.getFullName());
            row.add(siswa.getKelas());
            row.add(siswa.getSchoolName());
            row.add(siswa.getEmail());

            for (int i = 1; i <= 30; i++) {
                String levelKey = "level" + i;
                String levelJson = siswa.getLevels().get(levelKey);
                String cellValue = "";
                if (levelJson != null) {
                    try {
                        Map<String, Object> levelData = objectMapper.readValue(levelJson, new TypeReference<>() {});
                        StringBuilder sb = new StringBuilder();
                        for (Map.Entry<String, Object> entry : levelData.entrySet()) {
                            if (!"status".equals(entry.getKey()) && !"stars".equals(entry.getKey())) {
                                String question = entry.getKey().replace("_", " ");
                                sb.append(question).append(": ").append(entry.getValue()).append("\n");
                            }
                        }
                        cellValue = sb.toString().trim();
                    } catch (IOException e) {
                        cellValue = "Error parsing data";
                    }
                }
                row.add(cellValue);
            }
            data.add(row);
        }

        // 4. Call the universal export service
        excelExportService.exportToExcel(response, "data_siswa.xlsx", "Data Siswa", headers, data);
    }
}
