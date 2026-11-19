package com.campulse.location.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

import com.campulse.general.entity.BaseEntity;
import com.campulse.school.entity.School;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Country extends BaseEntity {

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 10)
    private String code;

    @OneToMany(mappedBy = "country")
    private List<Region> regions = new ArrayList<>();

    @OneToMany(mappedBy = "country")
    private List<State> states = new ArrayList<>();

    @OneToMany(mappedBy = "country")
    private List<School> schools = new ArrayList<>();
}