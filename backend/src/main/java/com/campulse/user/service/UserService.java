package com.campulse.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.campulse.general.exceptions.ResourceNotFoundException;
import com.campulse.user.dto.request.UpdateProfileRequest;
import com.campulse.user.dto.response.ProfileResponse;
import com.campulse.user.entity.User;
import com.campulse.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class UserService {

    private final UserRepository userRepository;


    private ProfileResponse toProfileResponse(User user) {
        return new ProfileResponse(
            user.getId(),
            user.getUsername(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getProfilePicture(),
            user.getBio(),
            user.getSchool().getName(),
            user.getDepartment() != null
                    ? user.getDepartment().getName()
                    : null
        );
    }

    @Transactional(readOnly = true)
    public ProfileResponse getMyProfile(String email){
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return toProfileResponse(user);
            
    }

    @Transactional
    public ProfileResponse updateMyProfile(
        String email,
        UpdateProfileRequest request
    ) 
    {

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (request.firstName() != null) {
            user.setFirstName(request.firstName());
        }

        if (request.lastName() != null) {
            user.setLastName(request.lastName());
        }

        if (request.bio() != null) {
            user.setBio(request.bio());
        }

        if (request.profilePicture() != null) {
            user.setProfilePicture(request.profilePicture());
        }    

        return toProfileResponse(user);  
        
    } 

}
