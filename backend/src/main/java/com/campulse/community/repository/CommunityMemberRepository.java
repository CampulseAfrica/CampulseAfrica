package com.campulse.community.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campulse.community.entity.CommunityMember;

import java.util.List;
import java.util.UUID;

public interface CommunityMemberRepository extends JpaRepository<CommunityMember, UUID> {

    List<CommunityMember> findByCommunityId(UUID communityId);

    List<CommunityMember> findByUserId(UUID userId);

    boolean existsByCommunityIdAndUserId(UUID communityId, UUID userId);
}