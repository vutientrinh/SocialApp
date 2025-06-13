package com.socialnetwork.controller;

import com.socialnetwork.exception.TokenRefreshException;
import com.socialnetwork.model.user.Role;
import com.socialnetwork.model.user.User;
import com.socialnetwork.model.enums.ERole;
import com.socialnetwork.model.token.RefreshToken;
import com.socialnetwork.repository.RoleRepository;
import com.socialnetwork.repository.UserRepository;
import com.socialnetwork.security.jwt.JwtUtils;
import com.socialnetwork.security.payload.request.LoginRequest;
import com.socialnetwork.security.payload.request.SignupRequest;
import com.socialnetwork.security.payload.request.TokenRefreshRequest;
import com.socialnetwork.security.payload.response.JwtResponse;
import com.socialnetwork.security.payload.response.MessageResponse;
import com.socialnetwork.security.payload.response.TokenRefreshResponse;
import com.socialnetwork.security.services.RefreshTokenService;
import com.socialnetwork.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    RefreshTokenService refreshTokenService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        // check user is active
        Optional<User> user = userRepository.findByUsername(loginRequest.getUsername());
        if (!user.isEmpty() && !user.get().isActive()) {
            return ResponseEntity.badRequest().body(new MessageResponse("User is not active!"));
        }
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateJwtToken(userDetails);
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getUUID());

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                refreshToken.getToken(),
                userDetails.getUUID(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getDefaultLocale(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {

        Optional<User> userNameExist = userRepository.existsByUsername(signUpRequest.getUsername());
        if (userNameExist.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        Optional<User> emailExist = userRepository.existsByEmail(signUpRequest.getUsername());
        if (emailExist.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository
                    .findByRoleName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "ROLE_ADMIN":
                        Role adminRole = roleRepository
                                .findByRoleName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "ROLE_MODERATOR":
                        Role modRole = roleRepository
                                .findByRoleName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleRepository
                                .findByRoleName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        // set default locale
        user.setDefaultLocale("en");
        user.setRegisterDateAt(LocalDateTime.now());
        user.setRoles(roles);
        user.setActive(true);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshtoken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService
                .findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtUtils.generateTokenFromUsername(user.getUsername());
                    return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken, "Refresh token is not in database!"));
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userUUID = userDetails.getUUID();
        refreshTokenService.deleteByUserId(userUUID);
        return ResponseEntity.ok(new MessageResponse("Log out successful!"));
    }

    @PostMapping("checkTokenRoleAdmin")
    public ResponseEntity<?> checkTokenRoleAdmin() {

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof UserDetailsImpl)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid user details type."));
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) principal;
        String userUUID = userDetails.getUUID();
        Optional<User> user = userRepository.findByUUID(userUUID);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: User is not found!"));
        }

        // Check if the user has the admin role
        Set<Role> roles = user.get().getRoles();
        boolean isAdmin = roles.stream().anyMatch(role -> role.getRoleName().equals(ERole.ROLE_ADMIN));

        if (isAdmin) {
            return ResponseEntity.ok(new MessageResponse("User has role admin."));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("User has unauthorized role."));
        }
    }

}
