package com.campulse.department.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

import com.campulse.community.entity.Community;
import com.campulse.faculty.entity.Faculty;
import com.campulse.general.entity.BaseEntity;
import com.campulse.user.entity.User;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Department extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(length = 20)
    private String code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    @OneToMany(mappedBy = "department")
    private List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "department")
    private List<Community> communities = new ArrayList<>();

    @Column(name = "external_department_id", unique = true)
    private Long externalDepartmentId;
}