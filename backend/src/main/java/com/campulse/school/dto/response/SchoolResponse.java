package com.campulse.school.dto.response;

import java.util.UUID;

public record SchoolResponse(
        UUID id,
        String name,
        String shortName,
        String website,
        String logoUrl,
        boolean verified,
        UUID countryId,
        UUID regionId,
        UUID stateId
) {
}