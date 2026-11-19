package com.campulse.community.entity;

import com.campulse.general.entity.BaseEntity;
import com.campulse.user.entity.User;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"community_id", "user_id"})
    }
)
public class CommunityMember extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}