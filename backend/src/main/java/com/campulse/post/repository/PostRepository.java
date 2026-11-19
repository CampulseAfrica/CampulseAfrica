package com.campulse.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campulse.post.entity.Post;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {

    List<Post> findByCommunitySchoolIdOrderByCreatedAtDesc(UUID schoolId);
    
    List<Post> findByCommunityIdOrderByCreatedAtDesc(UUID communityId);

    List<Post> findByUserIdOrderByCreatedAtDesc(UUID userId);
}