package com.campulse.comment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campulse.comment.entity.Comment;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {

    List<Comment> findByPostIdOrderByCreatedAtAsc(UUID postId);
}