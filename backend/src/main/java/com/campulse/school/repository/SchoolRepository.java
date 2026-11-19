package com.campulse.school.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campulse.school.entity.School;

import java.util.Optional;
import java.util.UUID;

public interface SchoolRepository extends JpaRepository<School, UUID> {
     Optional<School> findByNameIgnoreCase(String name);

     Optional<School> findByExternalInstitutionId(Long externalInstitutionId);

}