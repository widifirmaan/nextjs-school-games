package com.wmedia.buku.bukumedia.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

@Controller
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request, Model model) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        String errorMessage = "Something went wrong!";

        if (status != null) {
            Integer statusCode = Integer.valueOf(status.toString());

            if(statusCode == HttpStatus.NOT_FOUND.value()) {
                errorMessage = "Page Not Found";
            } else if(statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                errorMessage = "Internal Server Error";
            } else if(statusCode == HttpStatus.FORBIDDEN.value()) {
                errorMessage = "You don't have permission to access this page.";
            }
            model.addAttribute("status", statusCode);
        } else {
            model.addAttribute("status", "Error");
        }

        model.addAttribute("error", errorMessage);
        return "error";
    }
}
