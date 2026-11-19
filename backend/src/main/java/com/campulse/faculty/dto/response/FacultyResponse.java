package com.campulse.faculty.dto.response;

import java.util.UUID;

public record FacultyResponse(
        UUID id,
        String name,
        String code,
        UUID schoolId
) {}