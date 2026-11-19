package com.campulse.post.entity;

import com.campulse.comment.entity.Comment;
import com.campulse.community.entity.Community;
import com.campulse.general.entity.BaseEntity;
import com.campulse.general.enums.PostVisibility;
import com.campulse.reaction.entity.Reaction;
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
public class Post extends BaseEntity {

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private String mediaUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostVisibility visibility;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id")
    private Community community;

    @OneToMany(mappedBy = "post")
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "post")
    private List<Reaction> reactions = new ArrayList<>();
}