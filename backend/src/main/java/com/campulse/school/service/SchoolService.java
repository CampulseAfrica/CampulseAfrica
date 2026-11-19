package com.campulse.school.service;

import com.campulse.school.dto.response.SchoolResponse;
import com.campulse.school.entity.School;
import com.campulse.school.repository.SchoolRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SchoolService {

    private final SchoolRepository schoolRepository;

    public List<SchoolResponse> getAllSchools() {
        return schoolRepository.findAll().stream()
                .map(school -> new SchoolResponse(
                    school.getId(),
                    school.getName(),
                    school.getShortName(),
                    school.getWebsite(),
                    school.getLogoUrl(),
                    school.isVerified(),
                    school.getCountry().getId(),
                    school.getRegion().getId(),
                    school.getState().getId()
                ))
                .toList();
    }

    public SchoolResponse getSchoolById(UUID id){
        School school = schoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("School not found with id: " + id));

        return new SchoolResponse(
                school.getId(),
                school.getName(),
                school.getShortName(),
                school.getWebsite(),
                school.getLogoUrl(),
                school.isVerified(),
                school.getCountry().getId(),
                school.getRegion().getId(),
                school.getState().getId()
        );
    }
    
}