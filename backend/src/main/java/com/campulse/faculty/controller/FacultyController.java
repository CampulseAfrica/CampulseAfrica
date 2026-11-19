package com.campulse.faculty.controller;

import com.campulse.faculty.dto.response.FacultyResponse;
import com.campulse.faculty.service.FacultyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/faculties")
@RequiredArgsConstructor
public class FacultyController {

    private final FacultyService facultyService;

    @GetMapping("/school/{schoolId}")
    public List<FacultyResponse> getFacultiesBySchool(
            @PathVariable UUID schoolId) {
        return facultyService.getFacultiesBySchool(schoolId);
    }

    @GetMapping("/{id}")
    public FacultyResponse getFacultyById(
            @PathVariable UUID id) {
        return facultyService.getFacultyById(id);
    }
}