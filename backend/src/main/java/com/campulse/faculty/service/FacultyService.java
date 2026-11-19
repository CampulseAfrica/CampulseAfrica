package com.campulse.faculty.service;

import com.campulse.faculty.dto.response.FacultyResponse;
import com.campulse.faculty.entity.Faculty;
import com.campulse.faculty.repository.FacultyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FacultyService {

    private final FacultyRepository facultyRepository;

    public List<FacultyResponse> getFacultiesBySchool(UUID schoolId) {
        return facultyRepository.findBySchoolId(schoolId)
                .stream()
                .map(faculty -> new FacultyResponse(
                        faculty.getId(),
                        faculty.getName(),
                        faculty.getCode(),
                        faculty.getSchool().getId()
                ))
                .toList();
    }

    public FacultyResponse getFacultyById(UUID id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        return new FacultyResponse(
                faculty.getId(),
                faculty.getName(),
                faculty.getCode(),
                faculty.getSchool().getId()
        );
    }
}