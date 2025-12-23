package com.wmedia.buku.bukumedia.dto;

import java.util.Map;

/**
 * Interface-based projection for Siswa data.
 * This allows fetching only the specified fields from the database,
 * which is more efficient than fetching the entire User entity.
 * The method names here must match the getter methods of the target entity (User).
 */
public interface SiswaSummary {
    String getId();
    String getUsername();
    String getFullName();
    String getKelas();
    String getSchoolName();
    String getEmail();
    Map<String, String> getLevels();
}