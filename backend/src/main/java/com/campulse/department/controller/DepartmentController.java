package com.campulse.department.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.*;

import com.campulse.department.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import com.campulse.department.dto.response.DepartmentResponse;


@RestController 
@RequestMapping("/api/departments") 
@RequiredArgsConstructor 
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping("/faculty/{facultyId}")
    public List<DepartmentResponse> getDepartmentsByFaculty(
            @PathVariable UUID facultyId) {
        return departmentService.getDepartmentsByFaculty(facultyId);
    } 

    @GetMapping ("/{id}")
    public DepartmentResponse getDepartmentById(@PathVariable UUID id) {
        return departmentService.getDepartmentById(id);
    }

}
