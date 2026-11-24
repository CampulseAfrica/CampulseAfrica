package com.campulse.user.dto.response;

import java.util.UUID;

public record ProfileResponse(
        UUID id,
        String username,
        String firstName,
        String lastName,
        String email,
        String profilePicture,
        String bio,
        String schoolName,
        String departmentName
) {}