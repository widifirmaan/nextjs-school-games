package com.wmedia.buku.bukumedia.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wmedia.buku.bukumedia.model.User;
import com.wmedia.buku.bukumedia.repository.UserRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class ExportController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/guru/export")
    public void exportToExcel(HttpServletResponse response,
                              @RequestParam(required = false) String schoolName,
                              @RequestParam(required = false) String kelas,
                              @RequestParam(required = false) String searchName) throws IOException {

        // 1. Fetch and filter data (same logic as DashboardController)
        List<User> allSiswa = userRepository.findByRole("SISWA");
        List<User> filteredSiswa = allSiswa.stream()
            .filter(s -> schoolName == null || schoolName.isEmpty() || s.getSchoolName().equals(schoolName))
            .filter(s -> kelas == null || kelas.isEmpty() || s.getKelas().equals(kelas))
            .filter(s -> searchName == null || searchName.isEmpty() || s.getFullName().toLowerCase().contains(searchName.toLowerCase()))
            .collect(Collectors.toList());

        // 2. Create Excel Workbook
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Data Siswa");

        // 3. Create Header Row
        Row headerRow = sheet.createRow(0);
        String[] headers = {"Nama Lengkap", "Kelas", "Sekolah", "Email"};
        for (int i = 0; i < headers.length; i++) {
            headerRow.createCell(i).setCellValue(headers[i]);
        }
        for (int i = 1; i <= 30; i++) {
            headerRow.createCell(headers.length + i - 1).setCellValue("Level " + i);
        }

        // 4. Populate Data Rows
        int rowNum = 1;
        for (User siswa : filteredSiswa) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(siswa.getFullName());
            row.createCell(1).setCellValue(siswa.getKelas());
            row.createCell(2).setCellValue(siswa.getSchoolName());
            row.createCell(3).setCellValue(siswa.getEmail());

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
                Cell cell = row.createCell(headers.length + i - 1);
                cell.setCellValue(cellValue);
                CellStyle cellStyle = workbook.createCellStyle();
                cellStyle.setWrapText(true);
                cell.setCellStyle(cellStyle);
            }
        }

        // Auto-size columns
        for (int i = 0; i < headers.length + 30; i++) {
            sheet.autoSizeColumn(i);
        }

        // 5. Write to Response
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=data_siswa.xlsx");
        workbook.write(response.getOutputStream());
        workbook.close();
    }
}