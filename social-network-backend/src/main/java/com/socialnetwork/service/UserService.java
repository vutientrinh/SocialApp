package com.socialnetwork.service;

import com.socialnetwork.dtos.Responses.ActiveUserResponse;
import com.socialnetwork.model.enums.ERole;
import com.socialnetwork.model.user.Profile;
import com.socialnetwork.model.user.Role;
import com.socialnetwork.model.user.User;
import com.socialnetwork.repository.ProfileRepository;
import com.socialnetwork.repository.RoleRepository;
import com.socialnetwork.repository.UserRepository;
import com.socialnetwork.security.services.RefreshTokenService;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor

public class UserService {

    @Resource
    private RoleRepository roleRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Resource
    private UserRepository userRepository;

    @Resource
    private ProfileRepository profileRepository;

    @Autowired
    RefreshTokenService refreshTokenService;

    public User setRole(String uuid, String roleName) {

        Set<Role> ROLE = new HashSet<>();
        ERole eRole = ERole.valueOf(roleName);
        Role role_user = roleRepository
                .findByRoleName(eRole)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        ROLE.add(role_user);

        User user = userRepository.findByUUID(uuid).orElseThrow(()
                -> new RuntimeException("Error: User is not found."));

        user.setLastUpdatedAt(LocalDateTime.now());
        user.setRoles(ROLE);
        return userRepository.save(user);
    }

    public Page<User> getAllUser(Integer page, Integer size, String orderedBy, Boolean isAscending, String keyword) {
        Sort sort = Boolean.TRUE.equals(isAscending)
                ? Sort.by(orderedBy).ascending()
                : Sort.by(orderedBy).descending();

        PageRequest pageRequest = PageRequest.of(page - 1, size, sort);
        Page<User> userPage = userRepository.findByUsernameContainingIgnoreCase(keyword, pageRequest);
        return userPage;
    }

    public User getUserByEmail(String email) {
        User user = userRepository.findUsersByEmail(email).orElseThrow(()
                -> new RuntimeException("Can't find this user"));
        return user;
    }

    public Optional<User> getUserByUUID(String uuid) {
        Optional<User> user = userRepository.findByUUID(uuid);
        return user;
    }

    public User updateUserStatus(String uuid) {
        User user = userRepository.findByUUID(uuid)
                .orElseThrow(() -> new RuntimeException("Can't find this user"));
        if (user != null) {
            boolean status = user.isActive();
            if (status) {
                user.setActive(false);
            } else {
                user.setActive(true);
            }
            user.setLastUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        }
        return user;
    }

    public void deleteUser(String UUID) {
        User user = userRepository.findByUUID(UUID)
                .orElseThrow(() -> new RuntimeException("Can't find this user"));

        Profile profile = profileRepository.findByUser(user).orElseThrow(()
                -> new RuntimeException("Can't find this profile"));

        profileRepository.delete(profile);
        userRepository.delete(user);
    }

    public List<ActiveUserResponse> findAllActiveUsers() {
        return new ArrayList<>();
    }

    public Optional<User> getActiveUserByUserName(String username) {
        return userRepository.getActiveUserByUserName(username);
    }

    public void saveUser(String userUUID) {
        Profile userProfile = profileRepository.findProfileByUserUUID(userUUID);
        userProfile.setOnline(true);
        profileRepository.save(userProfile);
        System.out.print("Save successfully");
        messagingTemplate.convertAndSend("/topic/public", userProfile);
    }

    public void disconnect(String userUUID) {
        Profile userProfile = profileRepository.findProfileByUserUUID(userUUID);
        userProfile.setOnline(false);
        profileRepository.save(userProfile);
        messagingTemplate.convertAndSend("/topic/public", userProfile);
        System.out.print("Disconnect!!!");
    }
    public List<User> findConnectedUsers() {
        return userRepository.getActiveUser().get();
    }
}
