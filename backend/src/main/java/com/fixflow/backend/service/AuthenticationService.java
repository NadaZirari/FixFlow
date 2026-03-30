package com.fixflow.backend.service;

import com.fixflow.backend.dto.AuthenticationRequest;
import com.fixflow.backend.dto.AuthenticationResponse;
import com.fixflow.backend.entity.User;
import com.fixflow.backend.repository.UserRepository;
import com.fixflow.backend.exception.ResourceNotFoundException;
import com.fixflow.backend.security.JwtService;
import com.fixflow.backend.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RoleService roleService;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getMotDePasse()
                    )
            );
        } catch (org.springframework.security.authentication.DisabledException e) {
            logger.error("Authentication failed due to disabled account.");
            throw e;
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            logger.error("Authentication failed due to bad credentials.");
            throw e;
        }
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", request.getEmail()));
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .user(user)
                .build();
    }
}
