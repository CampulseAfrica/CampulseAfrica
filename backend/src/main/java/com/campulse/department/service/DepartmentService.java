package com.campulse.department.service;

import com.campulse.department.dto.response.DepartmentResponse;
import com.campulse.department.entity.Department;
import com.campulse.department.repository.DepartmentRepository;
import com.campulse.general.exceptions.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<DepartmentResponse> getDepartmentsByFaculty(UUID facultyId) {
        return departmentRepository.findByFacultyId(facultyId)
                .stream()
                .map(department -> new DepartmentResponse(
                        department.getId(),
                        department.getName(),
                        department.getCode(),
                        department.getFaculty().getId()
                ))
                .toList();
    }

    public DepartmentResponse getDepartmentById(UUID id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        return new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getCode(),
                department.getFaculty().getId()
        );
    }
}