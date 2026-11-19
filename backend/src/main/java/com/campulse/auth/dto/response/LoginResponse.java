package com.campulse.auth.dto.response;

public record LoginResponse(
        String accessToken,
        String refreshToken
) {
}