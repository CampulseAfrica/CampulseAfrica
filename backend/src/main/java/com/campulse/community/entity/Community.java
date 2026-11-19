package com.campulse.community.entity;

import com.campulse.department.entity.Department;
import com.campulse.general.entity.BaseEntity;
import com.campulse.general.enums.*;
import com.campulse.location.entity.Region;
import com.campulse.location.entity.State;
import com.campulse.post.entity.Post;
import com.campulse.school.entity.School;
import com.campulse.user.entity.User;

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
public class Community extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommunityScope scope;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    private School school;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_id")
    private State state;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region region;

    @OneToMany(mappedBy = "community")
    private List<CommunityMember> members = new ArrayList<>();

    @OneToMany(mappedBy = "community")
    private List<Post> posts = new ArrayList<>();
}