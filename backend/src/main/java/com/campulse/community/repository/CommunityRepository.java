package com.campulse.community.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campulse.community.entity.Community;

import java.util.List;
import java.util.UUID;

public interface CommunityRepository extends JpaRepository<Community, UUID> {

    List<Community> findBySchoolId(UUID schoolId);

}