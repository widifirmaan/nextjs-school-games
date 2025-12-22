package com.wmedia.buku.bukumedia.service;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Service
public class ExcelExportService {

    public void exportToExcel(HttpServletResponse response, String fileName, String sheetName, List<String> headers, List<List<Object>> data) throws IOException {
        // 1. Create Excel Workbook
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet(sheetName);

        // 2. Create Header Row
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < headers.size(); i++) {
            headerRow.createCell(i).setCellValue(headers.get(i));
        }

        // 3. Populate Data Rows
        int rowNum = 1;
        for (List<Object> rowData : data) {
            Row row = sheet.createRow(rowNum++);
            for (int i = 0; i < rowData.size(); i++) {
                Cell cell = row.createCell(i);
                Object cellValue = rowData.get(i);
                if (cellValue instanceof String) {
                    cell.setCellValue((String) cellValue);
                } else if (cellValue instanceof Number) {
                    cell.setCellValue(((Number) cellValue).doubleValue());
                } else {
                    cell.setCellValue(cellValue != null ? cellValue.toString() : "");
                }

                // Apply wrap text style for cells containing newlines
                if (cellValue != null && cellValue.toString().contains("\n")) {
                    CellStyle cellStyle = workbook.createCellStyle();
                    cellStyle.setWrapText(true);
                    cell.setCellStyle(cellStyle);
                }
            }
        }


        for (int i = 0; i < headers.size(); i++) {
            sheet.autoSizeColumn(i);
        }


        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
        workbook.write(response.getOutputStream());
        workbook.close();
    }
}
