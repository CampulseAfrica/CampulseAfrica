package com.campulse.user.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
    @Pattern(
        regexp = "(?s).*\\S.*",
        message = "First name cannot be blank"
    )
    @Size(max = 50, message = "First name cannot exceed 50 characters")
    String firstName,

    @Pattern(
        regexp = "(?s).*\\S.*",
        message = "Last name cannot be blank"
    )
    @Size(max = 50, message = "First name cannot exceed 50 characters")
    String lastName,

    @Size(max = 500, message = "Bio cannot exceed 500 characters")
    String bio,

     @Size(max = 2048, message = "Profile picture URL is too long")
    String profilePicture
) {}
