package com.campulse.school.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

import com.campulse.community.entity.Community;
import com.campulse.faculty.entity.Faculty;
import com.campulse.general.entity.BaseEntity;
import com.campulse.location.entity.Country;
import com.campulse.location.entity.Region;
import com.campulse.location.entity.State;
import com.campulse.user.entity.User;
import com.campulse.general.enums.SchoolType;
import com.campulse.general.enums.SchoolOwnership;


@Entity
@Getter
@Setter
@NoArgsConstructor
public class School extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 30)
    private String shortName;

    private String website;

    private String logoUrl;

    @Column(nullable = false)
    private boolean verified = false;

    @Column(name = "external_institution_id", unique = true)
    private Long externalInstitutionId;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private SchoolType type;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private SchoolOwnership ownership;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_id", nullable = false)
    private State state;

    @OneToMany(mappedBy = "school")
    private List<Faculty> faculties = new ArrayList<>();

    @OneToMany(mappedBy = "school")
    private List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "school")
    private List<Community> communities = new ArrayList<>();
}