package com.socialnetwork.service;

import com.socialnetwork.model.user.Profile;
import com.socialnetwork.model.user.Role;
import com.socialnetwork.model.user.User;
import com.socialnetwork.model.enums.ERole;
import com.socialnetwork.repository.ProfileRepository;
import com.socialnetwork.repository.RoleRepository;
import com.socialnetwork.repository.UserRepository;
import jakarta.annotation.Resource;
import net.datafaker.Faker;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
public class GenDataService {

    @Resource
    private UserRepository userRepository;

    @Resource
    private ProfileRepository profileRepository;

    @Resource
    private RoleRepository roleRepository;

    @Resource
    PasswordEncoder encoder;

    public void genData(int numUser) {

        // Role: Admin, User
        Set<Role> ROLE_ADMIN = new HashSet<>();
        Role role_admin = roleRepository
                .findByRoleName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        ROLE_ADMIN.add(role_admin);

        Set<Role> ROLE_USER = new HashSet<>();
        Role role_user = roleRepository
                .findByRoleName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        ROLE_USER.add(role_user);

        // Password: 123456
        String password = "123456";

        for (int i = 0; i < numUser; i++) {
            Faker faker = new Faker();

            String firstName = faker.name().firstName();
            String lastName = faker.name().lastName();
            String username = firstName + lastName;
            String email = username + "@gmail.com";

            // Create new user's account
            User user = new User(username, email, encoder.encode(password));
            user.setDefaultLocale("en");
            user.setRegisterDateAt(LocalDateTime.now());
            userRepository.save(user);

            // Gen new Profile
            String bio = faker.lorem().characters(100, 200);
            boolean is_online = faker.bool().bool();

            Profile profile = profileRepository.save(new Profile(firstName, lastName, bio, is_online));
            profile.setCreatedBy(user);
            profile.setCreatedAt(LocalDateTime.now());
            profileRepository.save(profile);
        }
    }
}
