package com.campulse.department.dto.response;

import java.util.UUID;

public record DepartmentResponse(
    UUID id,
    String name,
    String code,
    UUID facultyId
) {
}
