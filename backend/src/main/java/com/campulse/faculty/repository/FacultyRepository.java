package com.campulse.faculty.repository;

import com.campulse.faculty.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FacultyRepository extends JpaRepository<Faculty, UUID> {

    List<Faculty> findBySchoolId(UUID schoolId);

    boolean existsBySchoolIdAndNameIgnoreCase(UUID schoolId, String name);
     
    Optional<Faculty> findBySchoolIdAndNameIgnoreCase(
            UUID schoolId, String name);

    Optional<Faculty> findByExternalFacultyId(Long externalFacultyId);        
}