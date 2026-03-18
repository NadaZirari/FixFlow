package com.fixflow.backend.service;

import com.fixflow.backend.dto.AuthenticationRequest;
import com.fixflow.backend.dto.AuthenticationResponse;
import com.fixflow.backend.dto.RegisterRequest;
import com.fixflow.backend.entity.User;
import com.fixflow.backend.repository.UserRepository;
import com.fixflow.backend.security.JwtService;
import com.fixflow.backend.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RoleService roleService;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = new User(
                request.getNom(),
                request.getEmail(),
                passwordEncoder.encode(request.getMotDePasse())
        );
        user.setRole(roleService.findByNom("USER"));
        user.setEstActif(true);
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .user(user)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getMotDePasse()
                    )
            );
        } catch (org.springframework.security.authentication.DisabledException e) {
            System.out.println("DEBUG: AuthenticationService caught DisabledException for " + request.getEmail());
            throw e;
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            System.out.println("DEBUG: AuthenticationService caught BadCredentialsException for " + request.getEmail());
            throw e;
        }
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .user(user)
                .build();
    }
}
