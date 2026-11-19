package com.campulse.school.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.*;
import com.campulse.school.dto.response.SchoolResponse;
import com.campulse.school.service.SchoolService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping ("/api/schools")
@RequiredArgsConstructor  
public class SchoolController {
    private final SchoolService schoolService;

    @GetMapping
    public List<SchoolResponse> getAllSchools() {
        return schoolService.getAllSchools();
    }

    @GetMapping("/{id}")
    public SchoolResponse getSchoolById(@PathVariable UUID id) {
        return schoolService.getSchoolById(id);
    }
}
