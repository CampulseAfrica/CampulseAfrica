package com.campulse.department.repository;

import com.campulse.department.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DepartmentRepository extends JpaRepository<Department, UUID> {

    List<Department> findByFacultyId(UUID facultyId);

    boolean existsByFacultyIdAndNameIgnoreCase(UUID facultyId, String name);

    Optional<Department> findByFacultyIdAndNameIgnoreCase(
            UUID facultyId, String name);
    
    Optional<Department> findByExternalDepartmentId(Long externalDepartmentId);        
}