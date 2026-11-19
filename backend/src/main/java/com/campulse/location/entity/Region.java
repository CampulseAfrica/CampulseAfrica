package com.campulse.location.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

import com.campulse.community.entity.Community;
import com.campulse.general.entity.BaseEntity;
import com.campulse.school.entity.School;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Region extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @OneToMany(mappedBy = "region")
    private List<State> states = new ArrayList<>();

    @OneToMany(mappedBy = "region")
    private List<School> schools = new ArrayList<>();

    @OneToMany(mappedBy = "region")
    private List<Community> communities = new ArrayList<>();
}