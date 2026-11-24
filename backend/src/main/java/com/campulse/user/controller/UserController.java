package com.campulse.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campulse.user.dto.request.UpdateProfileRequest;
import com.campulse.user.dto.response.ProfileResponse;
import com.campulse.user.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("api/v1/users")
@RequiredArgsConstructor 
public class UserController {

    private final UserService userService;

    @GetMapping("/me") 
    public ResponseEntity<ProfileResponse> getMyProfile(
        Authentication authentication
    ){
        String email = authentication.getName();
        ProfileResponse profile = userService.getMyProfile(email);

        return ResponseEntity.ok(profile);
    }

    @PatchMapping("/me")
    public ResponseEntity<ProfileResponse> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        String email = authentication.getName();
        ProfileResponse profile = userService.updateMyProfile(email, request);

        return ResponseEntity.ok(profile);
    }

}
