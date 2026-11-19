package com.campulse.faculty.entity;

import com.campulse.department.entity.Department;
import com.campulse.general.entity.BaseEntity;
import com.campulse.school.entity.School;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Faculty extends BaseEntity {

    @Column(nullable = false, columnDefinition = "TEXT")
    private String name;

    @Column(length = 20)
    private String code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @OneToMany(mappedBy = "faculty")
    private List<Department> departments = new ArrayList<>();

    @Column(name = "external_faculty_id", unique = true)
    private Long externalFacultyId;
}