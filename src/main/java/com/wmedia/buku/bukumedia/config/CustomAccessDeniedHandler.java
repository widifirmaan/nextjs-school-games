package com.wmedia.buku.bukumedia.config;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_GURU"))) {
                response.sendRedirect("/guru/dashboard");
            } else if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SISWA"))) {
                response.sendRedirect("/siswa/dashboard");
            } else {
                response.sendRedirect("/login");
            }
        } else {
            response.sendRedirect("/login");
        }
    }
}
