package com.campulse.auth.service;

import com.campulse.auth.dto.request.LoginRequest;
import com.campulse.auth.dto.request.RegisterRequest;
import com.campulse.auth.dto.response.LoginResponse;
import com.campulse.department.entity.Department;
import com.campulse.department.repository.DepartmentRepository;
import com.campulse.general.enums.AccountStatus;
import com.campulse.general.enums.Role;
import com.campulse.school.entity.School;
import com.campulse.school.repository.SchoolRepository;
import com.campulse.security.service.JwtService;
import com.campulse.user.entity.User;
import com.campulse.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public void register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already exists");
        }

        School school = schoolRepository.findById(request.schoolId())
                .orElseThrow(() ->
                        new IllegalArgumentException("School not found"));

        Department department = null;

        if (request.departmentId() != null) {
            department = departmentRepository.findById(request.departmentId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Department not found"));
        }

        User user = new User();

        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());

        user.setSchool(school);
        user.setDepartment(department);

        user.setRole(Role.USER);
        user.setAccountStatus(AccountStatus.ACTIVE);

        userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid email or password"
                        ));

        if (!passwordEncoder.matches(
                request.password(),
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        String accessToken =
                jwtService.generateAccessToken(user);

        String refreshToken =
                jwtService.generateRefreshToken(user);

        return new LoginResponse(
                accessToken,
                refreshToken
        );
    }
}