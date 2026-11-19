
package com.campulse.integration.tertiary.service;

import com.campulse.department.entity.Department;
import com.campulse.department.repository.DepartmentRepository;
import com.campulse.faculty.entity.Faculty;
import com.campulse.faculty.repository.FacultyRepository;
import com.campulse.general.enums.SchoolOwnership;
import com.campulse.general.enums.SchoolType;
import com.campulse.integration.tertiary.dto.ExternalDepartmentDto;
import com.campulse.integration.tertiary.dto.ExternalSchoolDto;
import com.campulse.integration.tertiary.dto.InstitutionDetailDto;
import com.campulse.location.entity.Country;
import com.campulse.location.entity.Region;
import com.campulse.location.entity.State;
import com.campulse.location.repository.CountryRepository;
import com.campulse.location.repository.RegionRepository;
import com.campulse.location.repository.StateRepository;
import com.campulse.school.entity.School;
import com.campulse.school.repository.SchoolRepository;
import com.campulse.integration.tertiary.dto.TertiaryImportSummary;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
public class TertiaryInstitutionRecordImporter {

    private final SchoolRepository schoolRepository;
    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final CountryRepository countryRepository;
    private final RegionRepository regionRepository;
    private final StateRepository stateRepository;

    public TertiaryInstitutionRecordImporter(
            SchoolRepository schoolRepository,
            FacultyRepository facultyRepository,
            DepartmentRepository departmentRepository,
            CountryRepository countryRepository,
            RegionRepository regionRepository,
            StateRepository stateRepository) {

        this.schoolRepository = schoolRepository;
        this.facultyRepository = facultyRepository;
        this.departmentRepository = departmentRepository;
        this.countryRepository = countryRepository;
        this.regionRepository = regionRepository;
        this.stateRepository = stateRepository;
    }

    @Transactional
    public TertiaryImportSummary importInstitution(InstitutionDetailDto institution) {
        
        if (institution == null
                || institution.getName() == null
                || institution.getName().isBlank()) {
            throw new IllegalArgumentException(
                    "Institution name cannot be empty");
        }

        if (institution.getId() == null) {
                throw new IllegalArgumentException(
                        "External institution ID cannot be empty");
        }

        TertiaryImportSummary summary = new TertiaryImportSummary();

        Country nigeria = countryRepository.findByCode("NG")
                .orElseThrow(() -> new IllegalStateException(
                        "Nigeria (NG) was not found in the database"));

        State state = findState(nigeria, institution.getState());

        String regionName =
                NigerianRegionMapper.getRegionName(state.getName());

        Region region = regionRepository
                .findByCountryIdAndNameIgnoreCase(
                        nigeria.getId(), regionName)
                .orElseThrow(() -> new IllegalStateException(
                        "Region not found: " + regionName));

        SchoolType type = parseSchoolType(institution.getType());

        SchoolOwnership ownership =
                parseOwnership(institution.getCategory());

        var existingSchool = schoolRepository
                .findByExternalInstitutionId(institution.getId());

        School school;

        if (existingSchool.isPresent()) {
        school = existingSchool.get();
        } else {

        // Fallback for records created before external IDs.
        var existingSchoolByName = schoolRepository
                .findByNameIgnoreCase(institution.getName().trim());

        if (existingSchoolByName.isPresent()) {

                school = existingSchoolByName.get();

                // Do not associate an ID belonging to another institution.
                if (school.getExternalInstitutionId() != null
                        && !school.getExternalInstitutionId()
                                .equals(institution.getId())) {
                                        
                throw new IllegalStateException(
                        "External institution ID conflict for: "
                                + institution.getName());
                }

        } else {

                // Create a new institution.
                school = new School();
                school.setVerified(false);

                summary.setSchoolsCreated(1);
        }
        }

        // Synchronise fields managed by the external source.
        school.setExternalInstitutionId(institution.getId());
        school.setName(institution.getName().trim());
        school.setCountry(nigeria);
        school.setState(state);
        school.setRegion(region);
        school.setType(type);
        school.setOwnership(ownership);

        // Only update the website when the source supplies a value.
        // This prevents an empty source field from erasing existing data.
        if (institution.getWebsite() != null
                && !institution.getWebsite().isBlank()) {

        school.setWebsite(institution.getWebsite().trim());
        }

        school = schoolRepository.save(school);

        List<ExternalSchoolDto> externalSchools =
                institution.getSchools();

        if (externalSchools == null) {
            return summary;
        }

        for (ExternalSchoolDto externalSchool : externalSchools) {

        if (externalSchool == null
                || externalSchool.getId() == null
                || externalSchool.getName() == null
                || externalSchool.getName().isBlank()) {
                continue;
        }

        Long externalFacultyId = externalSchool.getId();
        String facultyName = externalSchool.getName().trim();

        // First, find faculty by external ID.
        var existingFacultyByExternalId =
                facultyRepository.findByExternalFacultyId(
                        externalFacultyId);

        Faculty faculty;

        if (existingFacultyByExternalId.isPresent()) {

                faculty = existingFacultyByExternalId.get();

                // Prevent an external ID from matching a faculty
                // belonging to another institution.
                if (!faculty.getSchool().getId().equals(school.getId())) {
                throw new IllegalStateException(
                        "Faculty external ID belongs to another school: "
                                + externalFacultyId);
                }

        } else {

                // Fallback: find faculty by name within this school.
                var existingFacultyByName =
                        facultyRepository.findBySchoolIdAndNameIgnoreCase(
                                school.getId(), facultyName);

                if (existingFacultyByName.isPresent()) {

                faculty = existingFacultyByName.get();

                if (faculty.getExternalFacultyId() != null
                        && !faculty.getExternalFacultyId()
                                .equals(externalFacultyId)) {

                        throw new IllegalStateException(
                                "Faculty external ID conflict: " + facultyName);
                }

                } else {

                faculty = new Faculty();
                faculty.setSchool(school);

                summary.setFacultiesCreated(
                        summary.getFacultiesCreated() + 1);
                }

                faculty.setExternalFacultyId(externalFacultyId);
        }

        // Synchronise the faculty name.
        faculty.setName(facultyName);

        faculty = facultyRepository.save(faculty);

        List<ExternalDepartmentDto> externalDepartments =
                externalSchool.getDepartments();

        if (externalDepartments == null) {
                continue;
        }

        for (ExternalDepartmentDto externalDepartment
                : externalDepartments) {

                if (externalDepartment == null
                        || externalDepartment.getId() == null
                        || externalDepartment.getName() == null
                        || externalDepartment.getName().isBlank()) {
                continue;
                }

                Long externalDepartmentId = externalDepartment.getId();
                String departmentName = externalDepartment.getName().trim();

                // First, find department by external ID.
                var existingDepartmentByExternalId =
                        departmentRepository.findByExternalDepartmentId(
                                externalDepartmentId);

                Department department;

                if (existingDepartmentByExternalId.isPresent()) {

                department = existingDepartmentByExternalId.get();

                // Ensure the department belongs to this faculty.
                if (!department.getFaculty().getId()
                        .equals(faculty.getId())) {

                        throw new IllegalStateException(
                                "Department external ID belongs to another faculty: "
                                        + externalDepartmentId);
                }

                } else {

                // Fallback: find department by name within this faculty.
                var existingDepartmentByName =
                        departmentRepository
                                .findByFacultyIdAndNameIgnoreCase(
                                        faculty.getId(), departmentName);

                if (existingDepartmentByName.isPresent()) {

                        department = existingDepartmentByName.get();

                        if (department.getExternalDepartmentId() != null
                                && !department.getExternalDepartmentId()
                                        .equals(externalDepartmentId)) {

                        throw new IllegalStateException(
                                "Department external ID conflict: "
                                        + departmentName);
                        }

                } else {

                        department = new Department();
                        department.setFaculty(faculty);

                        summary.setDepartmentsCreated(
                                summary.getDepartmentsCreated() + 1);
                }

                department.setExternalDepartmentId(
                        externalDepartmentId);
                }

                // Synchronise department name.
                department.setName(departmentName);

                departmentRepository.save(department);
        }
        }        

        return summary;
    }

    private State findState(Country country, String sourceStateName) {

        if (sourceStateName == null || sourceStateName.isBlank()) {
            throw new IllegalArgumentException(
                    "Institution state is missing");
        }

        String name = sourceStateName.trim();

        if (name.equalsIgnoreCase("FCT")
                || name.equalsIgnoreCase("FCT Abuja")
                || name.equalsIgnoreCase("Abuja")
                || name.equalsIgnoreCase("Federal Capital Territory, Abuja")) {

        name = "Federal Capital Territory";
        }

        State state = stateRepository
                .findByCountryIdAndNameIgnoreCase(
                        country.getId(), name)
                .orElse(null);

        if (state != null) {
            return state;
        }

        // Handle databases that store "Abia" instead of "Abia State".
        if (name.toLowerCase(Locale.ROOT).endsWith(" state")) {
            name = name.substring(0, name.length() - 6).trim();
        } else if (!name.equalsIgnoreCase("FCT")
                && !name.equalsIgnoreCase("Federal Capital Territory")) {
            name = name + " State";
        }

        state = stateRepository
                .findByCountryIdAndNameIgnoreCase(
                        country.getId(), name)
                .orElse(null);

        // Support either common name for the Federal Capital Territory.
        if (state == null
                && sourceStateName.trim().equalsIgnoreCase("FCT")) {
            state = stateRepository
                    .findByCountryIdAndNameIgnoreCase(
                            country.getId(),
                            "Federal Capital Territory")
                    .orElse(null);
        }

        if (state == null
                && sourceStateName.trim().equalsIgnoreCase(
                        "Federal Capital Territory")) {
            state = stateRepository
                    .findByCountryIdAndNameIgnoreCase(
                            country.getId(), "FCT")
                    .orElse(null);
        }

        if (state == null) {
            throw new IllegalStateException(
                    "State not found in database: " + sourceStateName);
        }

        return state;
    }

    private SchoolType parseSchoolType(String sourceType) {

        if (sourceType == null) {
            throw new IllegalArgumentException(
                    "Institution type is missing");
        }

        return switch (sourceType.trim().toLowerCase(Locale.ROOT)) {
            case "university" -> SchoolType.UNIVERSITY;
            case "polytechnic" -> SchoolType.POLYTECHNIC;
            case "college_of_education", "college of education" ->
                    SchoolType.COLLEGE_OF_EDUCATION;
            default -> throw new IllegalArgumentException(
                    "Unsupported institution type: " + sourceType);
        };
    }

    private SchoolOwnership parseOwnership(String sourceCategory) {

        if (sourceCategory == null) {
            throw new IllegalArgumentException(
                    "Institution ownership is missing");
        }

        return switch (sourceCategory.trim().toLowerCase(Locale.ROOT)) {
            case "federal" -> SchoolOwnership.FEDERAL;
            case "state" -> SchoolOwnership.STATE;
            case "private" -> SchoolOwnership.PRIVATE;
            default -> throw new IllegalArgumentException(
                    "Unsupported institution category: "
                            + sourceCategory);
        };
    }
}
