package com.campulse.reaction.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campulse.reaction.entity.Reaction;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReactionRepository extends JpaRepository<Reaction, UUID> {

    List<Reaction> findByPostId(UUID postId);

    Optional<Reaction> findByPostIdAndUserId(UUID postId, UUID userId);

    boolean existsByPostIdAndUserId(UUID postId, UUID userId);
}